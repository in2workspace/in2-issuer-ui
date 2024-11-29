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
  knowledgebase_url: "https://knowledgebase.dome-marketplace-sbx.org/",
  procedures: '/api/v1/procedures',
  save_credential: '/vci/v1/issuances',
  credential_offer_url: '/api/v1/credential-offer',
  notification: '/api/v1/notifications',
  //firma_credential: '/api/v1/sign-credential' The`firma_credential` variable has been commented out as it was initially intended for the signature functionality,which remains incomplete. This configuration is currently unnecessary for the existing flows but is expected to be reintroduced in the future when the related use case is implemented.
};
