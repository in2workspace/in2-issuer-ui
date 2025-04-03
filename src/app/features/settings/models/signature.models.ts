export interface SignatureConfigPayload {
    enableRemoteSignature: boolean;
    signatureMode: string;
}


export interface SignatureConfigTable{
    id:string;
    cloudProviderName:string;
    credentialName:string;
}


export interface signatureConfigurationRequest{
    organizationIdentifier: string;
    enableRemoteSignature: boolean;
    signatureMode: string;
    cloudProviderId: string;
    clientId: string;
    credentialId: string;
    credentialName: string;
    clientSecret : string;
    credentialPassword : string,
    secret ?: string;
}

export interface signatureConfigurationResponse{
    id:string;
    organizationIdentifier: string;
    enableRemoteSignature: boolean;
    signatureMode: string;
    cloudProviderId: string;
    clientId: string;
    credentialId: string;
    credentialName: string;
}


export interface cloudProvider {
    id: string;
    provider: string;
    url: string;
    authMethod: string;
    authGrantType: string;
    requiresTOTP: boolean;
} 



export enum SignatureMode {
    SERVER = 'SERVER',
    CLOUD = 'CLOUD'
}

export type FormMode = 'create' | 'edit' | 'delete';