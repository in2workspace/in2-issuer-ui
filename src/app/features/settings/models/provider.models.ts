export interface CloudProvider {
    id: string;
    provider: string;
    url: string;
    authMethod: string;
    authGrantType: string;
    requiresTOTP: boolean;
}