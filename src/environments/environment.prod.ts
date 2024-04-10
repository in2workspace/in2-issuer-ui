export const environment = {
  production: true,
  loginParams: {
    has_login: true,
    login_url: window["env"]["login_url"] || 'http://localhost:9099/realms/wallet',
    client_id: window["env"]["client_id"] || 'auth-client',
    scope: window["env"]["scope"] || 'openid profile email offline_access',
    grant_type: window["env"]["grant_type"] || 'code'
  },
  issuer_url: window["env"]["issuer_url"] || '',
  issuer_uri: window["env"]["issuer_uri"] || '',
  base_url: window["env"]["base_url"] || 'https://localhost:8071',
  wallet_url: window["env"]["wallet_url"] || 'https://localhost:4200'
};
