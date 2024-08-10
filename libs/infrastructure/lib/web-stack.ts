import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { join } from 'path';


export interface WebStackProps extends StackProps {
  s3Bucket: Bucket,
  cloudfrontDistribution: Distribution;
}
export class WebStack extends Stack {

  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props);

    new BucketDeployment(this, 'AdventCalendarWebBucketDeployment', {
      destinationBucket: props.s3Bucket,
      sources: [Source.asset(join(__dirname, '../../../dist/apps/web'))],
      distribution: props.cloudfrontDistribution,
      distributionPaths: ['/*'],
      retainOnDelete: false
    });

  }
}
