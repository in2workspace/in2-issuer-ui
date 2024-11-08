export const environment = {
  production: true,
  loginParams: {
    has_login: true,
    login_url: window["env"]["login_url"] || 'https://localhost:8443/realms/CredentialIssuer',
    client_id: window["env"]["client_id"] || 'account-console',
    scope: window["env"]["scope"] || 'openid profile email offline_access',
    grant_type: window["env"]["grant_type"] || 'code'
  },
  base_url: window["env"]["base_url"] || 'http://localhost:8081',
  wallet_url: window["env"]["wallet_url"] || 'http://localhost:4200',
  knowledgebase_url: window["env"]["knowledgebase_url"] || "https://knowledgebase.dome-marketplace-sbx.org/",
  procedures: window["env"]["procedures"] || '/api/v1/procedures',
  save_credential: window["env"]["saveCredential"] || '/vci/v1/issuances',
  credential_offer_url: window["env"]["credential_offer_url"] || '/api/v1/credential-offer',
  notification: window["env"]["notification"] || '/api/v1/notifications',
  firma_credential: window["env"]["firma_credential"] || '/api/v1/sign-credential'
};
