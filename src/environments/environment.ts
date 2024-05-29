export const environment = {
  production: false,
  loginParams: {
    has_login: true,
    login_url: 'https://localhost:8443/realms/master',
    client_id: 'account-console',
    scope: 'openid profile email offline_access',
    grant_type: 'code'
  },
  base_url: 'http://localhost',
  wallet_url: 'http://localhost:4200',
  api_base_url: '/api/v1/credentials?type=LEARCredentialEmployee',
  credential_offer_url: '/api/v1/credential-offer'
};
