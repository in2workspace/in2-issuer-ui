export const environment = {
  production: true,
  loginParams: {
    has_login: true,
    iam_uri: window["env"]["iam_uri"] || 'http://localhost:8088/realms/EAAProvider',
    client_id: window["env"]["client_id"] || 'auth-client',
    scope: window["env"]["scope"] || 'openid profile email offline_access',
    grant_type: window["env"]["grant_type"] || 'code'
  },
  base_url: window["env"]["base_url"] || 'https://localhost',
  wallet_url: window["env"]["wallet_url"] || 'https://localhost:4200',
  api_base_url: window["env"]["api_base_url"] || '/api/v1/credentials?type=LEARCredentialEmployee',
  credential_offer_url: window["env"]["credential_offer_url"] || '/api/v1/credential-offer'
};
