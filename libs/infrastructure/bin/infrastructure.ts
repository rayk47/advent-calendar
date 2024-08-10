#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { WebStack } from '../lib/web-stack';
import { getConfig } from '../lib/env/env-config';
import { CloudfrontStackStack } from '../lib/cloudfront.stack';
import { ApiGatewayStack } from '../lib/api-gateway.stack';
import { CognitoStack } from '../lib/cognito.stack';
import { DNSStackStack } from '../lib/dns-stack';

const app = new App();

const config = getConfig();

const dnsStack = new DNSStackStack(app, 'AdventCalendarDNSStack', { domainName: config.DOMAIN_NAME, fqdn: config.FQDN, env: { region: config.REGION } });

const cloudfrontStack = new CloudfrontStackStack(app, 'AdventCalendarCloudfrontStack', { certificate: dnsStack.certificateForDomain, hostedZone: dnsStack.hostedZone, domainName: config.DOMAIN_NAME, fqdn: config.FQDN, env: { region: config.REGION } });

const cognitoStack = new CognitoStack(app, 'AdventCalendarCognitoStack', {
    redirectUrl: config.FQDN,
    initialUsername: config.INITIAL_USERNAME,
    initialPassword: config.INITIAL_PASSWORD,
    env: { region: config.REGION },
    domainName: config.DOMAIN_NAME,
    certificate: dnsStack.certificateForDomain,
    hostedZone: dnsStack.hostedZone
});

new ApiGatewayStack(app, 'AdventCalendarApiGatewayStack', { userPoolArn: cognitoStack.userPool.userPoolArn, cloudfrontDistribution: cloudfrontStack.cloudfrontDistribution, loginUrl: cognitoStack.loginUrl, env: { region: config.REGION } });

new WebStack(app, 'AdventCalendarWebStack', { s3Bucket: cloudfrontStack.s3Bucket, cloudfrontDistribution: cloudfrontStack.cloudfrontDistribution, env: { region: config.REGION } });
