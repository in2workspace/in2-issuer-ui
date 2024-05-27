export const environment = {
  production: true,
  loginParams: {
    has_login: true,
    login_url: window["env"]["login_url"] || 'http://localhost:8088/realms/EAAProvider',
    client_id: window["env"]["client_id"] || 'auth-client',
    scope: window["env"]["scope"] || 'openid profile email offline_access',
    grant_type: window["env"]["grant_type"] || 'code'
  },
  base_url: window["env"]["base_url"] || 'https://localhost:8071',
  wallet_url: window["env"]["wallet_url"] || 'https://localhost:4200',
  api_base_url: window["env"]["api_base_url"] || '/api/v1/credentials?type=LEARCredentialEmployee',
  credential_offer_url: window["env"]["credential_offer_url"] || '/api/v1/credential-offer'
};
