export const environment = {
  production: true,
  loginParams: {
    has_login: true,
    login_url: 'http://localhost:9099/realms/wallet',
    client_id: 'auth-client',
    scope: 'openid profile email offline_access',
    grant_type: 'code'
  },
  issuer_url: '',
  issuer_uri: '',
};
