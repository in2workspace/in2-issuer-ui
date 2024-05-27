export const environment = {
  production: false,
  loginParams: {
    has_login: true,
    login_url: 'http://localhost:8088/realms/EAAProvider',
    client_id: 'oidc4vci-wallet-client',
    scope: 'openid profile email offline_access',
    grant_type: 'code'
  },
  base_url: 'http://localhost:8082',
  wallet_url: 'http://localhost:4200',
  api_base_url: '/api/v1/credentials?type=LEARCredentialEmployee',
  credential_offer_url: '/api/v1/credential-offer'
};
