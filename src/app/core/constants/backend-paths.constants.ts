// todo Consider renaming
export const BACKEND_PATH = Object.freeze({
    PROCEDURES: window["env"]["procedures"] || '/api/v1/procedures',
    SAVE_CREDENTIAL: window["env"]["saveCredential"] || '/vci/v1/issuances',
    CREDENTIAL_OFFER: window["env"]["credential_offer_url"] || '/api/v1/credential-offer',
    NOTIFICATION: window["env"]["notification"] || '/api/v1/notifications',
    SIGN_CREDENTIAL: window["env"]["sign_credential_url"] || '/api/v1/retry-sign-credential',
});