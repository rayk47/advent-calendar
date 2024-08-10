import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Cors, ResponseType } from 'aws-cdk-lib/aws-apigateway';
import { RestApiOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CacheCookieBehavior, CacheHeaderBehavior, CachePolicy, CacheQueryStringBehavior, Distribution, ViewerProtocolPolicy, AllowedMethods } from 'aws-cdk-lib/aws-cloudfront';
import { AuthorizationType, CfnAuthorizer, LambdaIntegration, Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

interface ApiGatewayStackProps extends StackProps {
    loginUrl: string;
    cloudfrontDistribution: Distribution;
    userPoolArn: string;
}

export class ApiGatewayStack extends Stack {
    rootApi: RestApi;
    restApiId: string;
    baseApiResource: Resource;

    constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
        super(scope, id, props);

        this.rootApi = new RestApi(this, 'AdventCalendarApiGateway', {
            restApiName: 'AdventCalendarApiGateway',
            description: 'An API to manage the advent calendar',
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowHeaders: Cors.DEFAULT_HEADERS,
                allowMethods: Cors.ALL_METHODS
            }
        })
        this.rootApi.applyRemovalPolicy(RemovalPolicy.DESTROY);
        this.restApiId = this.rootApi.restApiId;
        this.baseApiResource = this.rootApi.root.addResource('api');
        this.addHandlingOfAccessDenied(props.loginUrl);
        this.attachToCloudfront(props.cloudfrontDistribution);
        this.addEventLambdas(this.restApiId, this.baseApiResource, props.userPoolArn);
    }

    addHandlingOfAccessDenied = (loginUrl: string) => {
        this.rootApi.addGatewayResponse('401GatewayResponse', {
            type: ResponseType.UNAUTHORIZED,
            statusCode: '401',
            responseHeaders: {
                'Access-Control-Allow-Origin': "'*'"
            },
            templates: {
                'application/json': `{ "message": $context.error.messageString, "statusCode": "401", "type": "$context.error.responseType", "loginUrl":"${loginUrl}" }`
            }
        })

        this.rootApi.addGatewayResponse('403GatewayResponse', {
            type: ResponseType.ACCESS_DENIED,
            statusCode: '403',
            responseHeaders: {
                'Access-Control-Allow-Origin': "'*'"
            },
            templates: {
                'application/json': `{ "message": $context.error.messageString, "statusCode": "403", "type": "$context.error.responseType" }`
            }
        })
    }

    attachToCloudfront = (cloudfrontDistribution: Distribution) => {
        const origin = new RestApiOrigin(this.rootApi);

        // Create a Cache Policy to forward specific headers
        const cachePolicy = new CachePolicy(this, 'CachePolicy', {
            headerBehavior: CacheHeaderBehavior.allowList('Authorization'),
            queryStringBehavior: CacheQueryStringBehavior.all(),
            cookieBehavior: CacheCookieBehavior.all(),
        });

        cloudfrontDistribution.addBehavior('/api/*', origin, {
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            allowedMethods: AllowedMethods.ALLOW_ALL,
            cachePolicy: cachePolicy
        });
    }


    addEventLambdas = (restApiId: string, apiResource: Resource, userPoolArn: string) => {
        const eventsResource = apiResource.addResource('events');
        eventsResource.applyRemovalPolicy(RemovalPolicy.DESTROY);
        const eventIdResource = eventsResource.addResource('{eventId}');
        eventIdResource.applyRemovalPolicy(RemovalPolicy.DESTROY);

        const getAllEventInfo = new NodejsFunction(this, "getAllEventInfo", {
            runtime: Runtime.NODEJS_18_X, //TODO: Upgrade to Node 20
            projectRoot: join(__dirname, '../../../'),
            depsLockFilePath: join(__dirname, '../../../package-lock.json'),
            handler: "getAllEventInfo",
            functionName: "getAllEventInfo",
            entry: join(__dirname, '../../../libs/services/src/lib/events/events-api-gateway-handler.ts'),
        });
        getAllEventInfo.applyRemovalPolicy(RemovalPolicy.DESTROY);
        const getAllEventInfoIntegration = new LambdaIntegration(getAllEventInfo);

        const getEventGift = new NodejsFunction(this, "getEventGift", {
            runtime: Runtime.NODEJS_18_X,
            projectRoot: join(__dirname, '../../../'),
            depsLockFilePath: join(__dirname, '../../../package-lock.json'),
            handler: "getEventGift",
            functionName: "getEventGift",
            entry: join(__dirname, '../../../libs/services/src/lib/events/events-api-gateway-handler.ts'),
        });
        getEventGift.applyRemovalPolicy(RemovalPolicy.DESTROY);
        const getEventGiftIntegration = new LambdaIntegration(getEventGift);

        const authorizer = new CfnAuthorizer(this, 'cfnAuth', {
            restApiId: restApiId,
            name: 'adventCalendarAuthorizer',
            type: 'COGNITO_USER_POOLS',
            identitySource: 'method.request.header.Authorization',
            providerArns: [userPoolArn],
        });
        authorizer.applyRemovalPolicy(RemovalPolicy.DESTROY);

        eventsResource.addMethod('GET', getAllEventInfoIntegration, {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.ref
            }
        });

        eventIdResource.addMethod('GET', getEventGiftIntegration, {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.ref
            }
        });
    }
}
