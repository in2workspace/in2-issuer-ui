export const environment = {
  production: true,
  loginParams: {
    has_login: true,
    login_url: 'http://localhost:8088/realms/CredentialIssuer',
    client_id: 'oidc4vci-wallet-client',
    scope: 'openid profile email offline_access',
    grant_type:'code'
  },
  issuer_url: '',
  issuer_uri: '',
  base_url: 'http://localhost:8071',
  wallet_url: 'http://localhost:4200'
};
