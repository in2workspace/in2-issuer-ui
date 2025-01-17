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
  wallet_url_test: window["env"]["wallet_url_test"] || 'http://localhost:4200',
  knowledgebase_url: window["env"]["knowledgebase_url"] || "https://knowledgebase.dome-marketplace-sbx.org/",
  profile: window["env"]["profile"] || "lcl", //values: 'lcl', 'sbx', 'test', 'production'
  procedures: window["env"]["procedures"] || '/api/v1/procedures',
  save_credential: window["env"]["saveCredential"] || '/vci/v1/issuances',
  credential_offer_url: window["env"]["credential_offer_url"] || '/api/v1/credential-offer',
  notification: window["env"]["notification"] || '/api/v1/notifications'
  //firma_credential: window["env"]["firma_credential"] || '/api/v1/sign-credential' The`firma_credential` variable has been commented out as it was initially intended for the signature functionality,which remains incomplete. This configuration is currently unnecessary for the existing flows but is expected to be reintroduced in the future when the related use case is implemented.
};
