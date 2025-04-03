export interface SignatureConfigPayload {
    enableRemoteSignature: boolean;
    signatureMode: string;
}


export interface SignatureConfigTable{
    id:string;
    cloudProviderName:string;
    credentialName:string;
}


export interface SignatureConfigurationRequest{
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

export interface SignatureConfigurationResponse{
    id:string;
    enableRemoteSignature: boolean;
    signatureMode: string;
    cloudProviderId: string;
    clientId: string;
    credentialId: string;
    credentialName: string;
}


export interface UpdateSignatureConfigurationRequest
  extends SignatureConfigurationRequest {
  rationale: string;
}



export enum SignatureMode {
    SERVER = 'SERVER',
    CLOUD = 'CLOUD'
}

export type FormMode = 'create' | 'edit' | 'delete';