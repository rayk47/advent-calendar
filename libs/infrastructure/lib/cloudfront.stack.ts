import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { AllowedMethods, Distribution, OriginAccessIdentity, SecurityPolicyProtocol, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { ARecord, RecordTarget, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';


export interface CloudfrontStackProps extends StackProps {
    fqdn: string;
    domainName: string;
    certificate: Certificate;
    hostedZone: IHostedZone;
}

export class CloudfrontStackStack extends Stack {
    cloudfrontDistribution: Distribution;
    s3Bucket: Bucket;

    constructor(scope: Construct, id: string, props: CloudfrontStackProps) {
        super(scope, id, props);

        const cloudFrontOAI = new OriginAccessIdentity(this, 'AdventCalendarOriginAccessIdentity');
        cloudFrontOAI.applyRemovalPolicy(RemovalPolicy.DESTROY);

        // Content bucket
        this.s3Bucket = new Bucket(this, 'AdventCalendarWebsiteBucket', {
            bucketName: props.fqdn + '-web',
            publicReadAccess: false,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        });
        this.s3Bucket.applyRemovalPolicy(RemovalPolicy.DESTROY);

        // Grant access to cloudfront
        this.s3Bucket.addToResourcePolicy(new PolicyStatement({
            actions: ['s3:GetObject'],
            resources: [this.s3Bucket.arnForObjects('*')],
            principals: [new CanonicalUserPrincipal(cloudFrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));

        // CloudFront distribution
        this.cloudfrontDistribution = new Distribution(this, 'AdventCalendarSiteDistribution', {
            certificate: props.certificate,
            defaultRootObject: "index.html",
            domainNames: [props.fqdn],
            minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 403,
                    responsePagePath: '/error.html',
                    ttl: Duration.minutes(30),
                }
            ],
            defaultBehavior: {
                origin: new S3Origin(this.s3Bucket, { originAccessIdentity: cloudFrontOAI }),
                compress: true,
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            }
        })
        this.cloudfrontDistribution.applyRemovalPolicy(RemovalPolicy.DESTROY);

        // Route53 alias record for the CloudFront distribution
        const route53Record = new ARecord(this, 'AdventCalendarSiteAliasRecord', {
            recordName: props.fqdn,
            target: RecordTarget.fromAlias(new CloudFrontTarget(this.cloudfrontDistribution)),
            zone: props.hostedZone
        });
        route53Record.applyRemovalPolicy(RemovalPolicy.DESTROY);
    }
}
