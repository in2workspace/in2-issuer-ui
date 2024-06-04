export const environment = {
  production: false,
  loginParams: {
    // login_url: 'https://localhost:8443/realms/master',
    login_url: 'https://localhost:8443/realms/CredentialIssuer',
    client_id: 'account-console',
    scope: 'openid profile email offline_access',
    grant_type: 'code'
  },
  base_url: 'https://localhost',
  api_base_url: '/api/v1/credentials?type=LEARCredentialEmployee',
  credential_offer_url: '/api/v1/credential-offer',
  procedures_path: '/api/v1/procedures'
}
