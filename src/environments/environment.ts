export const environment = {
  production: false,
  loginParams: {
    // login_url: 'https://localhost:8443/realms/master',
    login_url: 'https://localhost:8443/realms/CredentialIssuer',
    client_id: 'account-console',
    scope: 'openid profile email offline_access',
    grant_type: 'code'
  },
  base_url: 'http://localhost:8081',
  wallet_url: 'http://localhost:4200',
  procedures: '/api/v1/procedures',
  save_credential: '/api/v1/credentials?type=LEARCredentialEmployee',
  credential_offer_url: '/api/v1/credential-offer',
  notification: '/api/v1/notification',
};
