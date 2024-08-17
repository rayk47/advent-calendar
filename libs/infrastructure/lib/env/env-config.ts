import { config as dotenv } from 'dotenv';
import { join } from 'path';

dotenv({ path: join(__dirname, '../../.env') });

export type ConfigProps = {
    REGION: string;
    DOMAIN_NAME: string;
    SUBDOMAIN_NAME: string;
    INITIAL_USERNAME: string;
    INITIAL_PASSWORD: string;
    FQDN: string;
    IS_WEB_LOCAL: boolean;
};

export const getConfig = (): ConfigProps => {
    const domainName = process.env.DOMAIN_NAME;
    const subdomainName = process.env.SUBDOMAIN_NAME;
    const initialUsername = process.env.INITIAL_USERNAME;
    const initialPassword = process.env.INITIAL_PASSWORD;
    const isWebLocal = process.env.IS_WEB_LOCAL === 'true' ? true : false

    if (!domainName) {
        throw new Error(`ENV Variable DOMAIN_NAME is required`);
    }

    if (!subdomainName) {
        throw new Error(`ENV Variable SUBDOMAIN_NAME is required`);
    }

    if (!initialUsername) {
        throw new Error(`ENV Variable INITIAL_USERNAME is required`);
    }

    if (!initialPassword) {
        throw new Error(`ENV Variable INITIAL_PASSWORD is required`);
    }
    return {
        REGION: process.env.REGION || "us-east-1",
        DOMAIN_NAME: domainName,
        SUBDOMAIN_NAME: subdomainName,
        INITIAL_USERNAME: initialUsername,
        INITIAL_PASSWORD: initialPassword,
        FQDN: subdomainName + '.' + domainName,
        IS_WEB_LOCAL: isWebLocal
    }
}