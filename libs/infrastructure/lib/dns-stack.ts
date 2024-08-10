import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IHostedZone, HostedZone } from 'aws-cdk-lib/aws-route53';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';



export interface DNSStackProps extends StackProps {
    fqdn: string
    domainName: string
}

export class DNSStackStack extends Stack {
    certificateForDomain: Certificate;
    hostedZone: IHostedZone;

    constructor(scope: Construct, id: string, props: DNSStackProps) {
        super(scope, id, props);

        //TODO: This should be setup by the infrastructure
        this.hostedZone = HostedZone.fromHostedZoneAttributes(this, "AdevntCalendarHostedZone", {
            zoneName: props.domainName,
            hostedZoneId: 'Z09767703BNP203G3HTGV'
        });
        // hostedZone.applyRemovalPolicy(RemovalPolicy.DESTROY);

        // TLS certificate
        this.certificateForDomain = new Certificate(this, 'AdventCalendarSiteCertificate', {
            domainName: '*.' + props.domainName,
            validation: CertificateValidation.fromDns(this.hostedZone),
        });
        this.certificateForDomain.applyRemovalPolicy(RemovalPolicy.DESTROY);
    }
}
