export const API_PATH = Object.freeze({
    PROCEDURES: '/api/v1/procedures',
    SAVE_CREDENTIAL: '/api/v1/credentials?type=LEARCredentialEmployee',
    CREDENTIAL_OFFER: '/api/v1/credential-offer',
    NOTIFICATION: '/api/v1/notifications',
    // todo (integració Pol) SIGN_CREDENTIAL: '/api/v1/retry-sign-credential',
    // todo (integració Pol) FIRMA_CREDENTIAL: '/api/v1/sign-credential' The`firma_credential` variable has been commented out as it was initially intended for the signature functionality,which remains incomplete. This configuration is currently unnecessary for the existing flows but is expected to be reintroduced in the future when the related use case is implemented.
    CONFIGURATION: '/api/v1/configuration',
    SIGNATURE_CONFIG:'/api/v1/signatures/configs',
    CLOUD_PROVIDER:'/api/v1/signatures/cloud-providers'


});