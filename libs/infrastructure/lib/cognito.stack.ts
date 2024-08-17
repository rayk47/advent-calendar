import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { OAuthScope, UserPool, UserPoolDomain, UserPoolClientIdentityProvider } from 'aws-cdk-lib/aws-cognito';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AwsCustomResource, AwsCustomResourcePolicy } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { UserPoolDomainTarget } from 'aws-cdk-lib/aws-route53-targets';



interface CognitoStackProps extends StackProps {
    redirectUrl: string;
    domainName: string;
    certificate: Certificate;
    initialUsername: string;
    initialPassword: string;
    hostedZone: IHostedZone;
    isWebLocal: boolean;
}

export class CognitoStack extends Stack {
    userPool: UserPool;
    loginUrl: string;

    constructor(scope: Construct, id: string, props: CognitoStackProps) {
        super(scope, id, props);

        this.userPool = new UserPool(this, 'AuthAdventCalendar', {
            userPoolName: "advent-calendar-userpool",
            selfSignUpEnabled: false,
            signInAliases: {
                email: true,
                phone: true,
                username: true
            }
        });
        this.userPool.applyRemovalPolicy(RemovalPolicy.DESTROY);

        const callbackUrl = props.isWebLocal ? 'http://localhost:4200' : 'https://' + props.redirectUrl;
        const client = this.userPool.addClient('AdventCalendarClient',
            {
                oAuth: {
                    flows: {
                        implicitCodeGrant: true
                    },
                    scopes: [OAuthScope.OPENID],
                    callbackUrls: [callbackUrl]
                },
                supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO]
            }
        );
        client.applyRemovalPolicy(RemovalPolicy.DESTROY);

        const userPoolDomain = new UserPoolDomain(this, 'AdventCalendarUserPoolDomain', {
            userPool: this.userPool,
            customDomain: {
                domainName: `auth.${props.domainName}`,
                certificate: props.certificate,
            },
        });
        userPoolDomain.applyRemovalPolicy(RemovalPolicy.DESTROY);

        const aRecord = new ARecord(this, 'AdventCalendarUserPoolDomainAliasRecord', {
            zone: props.hostedZone,
            recordName: `auth.${props.domainName}`,
            target: RecordTarget.fromAlias(new UserPoolDomainTarget(userPoolDomain)),
        });
        aRecord.applyRemovalPolicy(RemovalPolicy.DESTROY);

        this.loginUrl = `https://auth.${props.domainName}/oauth2/authorize?client_id=${client.userPoolClientId}&response_type=token&scope=openid&redirect_uri=${callbackUrl}`;

        new AwsCustomResource(this,
            "AdventCalendarUserPoolDomainNameCustomResourceCreateUser",
            {
                policy: AwsCustomResourcePolicy.fromStatements([
                    new PolicyStatement({
                        effect: Effect.ALLOW,
                        actions: [
                            "cognito-idp:AdminCreateUser"
                        ],
                        resources: ["*"]
                    })
                ]),
                onCreate: {
                    service: "CognitoIdentityServiceProvider",
                    action: "adminCreateUser",
                    parameters: {
                        UserPoolId: this.userPool.userPoolId,
                        Username: props.initialUsername,
                        TemporaryPassword: props.initialPassword,
                        UserAttributes: [
                        ],
                        MessageAction: "SUPPRESS"
                    },
                    physicalResourceId: {
                        id: 'userpoolcreateid' + Date.now().toString()
                    }
                }
            });

    }
}
