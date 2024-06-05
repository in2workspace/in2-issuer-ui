export const environment = {
  production: true,
  loginParams: {
    has_login: true,
    login_url: window["env"]["login_url"] || 'http://localhost:8088/realms/EAAProvider',
    client_id: window["env"]["client_id"] || 'auth-client',
    scope: window["env"]["scope"] || 'openid profile email offline_access',
    grant_type: window["env"]["grant_type"] || 'code'
  },
  base_url: window["env"]["base_url"] || 'https://localhost',
  wallet_url: window["env"]["wallet_url"] || 'http://localhost:4200',
  procedures: window["env"]["procedures"] || '/api/v1/procedures',
  save_credential: window["env"]["saveCredential"] || 'https://localhost:4200',
  credential_offer_url: window["env"]["credential_offer_url"] || '/api/v1/credentials?type=LEARCredentialEmployee',
  notification: window["env"]["notification"] || '/api/v1/credential-offer'
};
