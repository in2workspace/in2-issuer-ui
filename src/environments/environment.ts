export const environment = {
  production: false,
  loginParams: {
    login_url: 'https://localhost:8443/realms/CredentialIssuer',
    client_id: 'account-console',
    scope: 'openid profile email offline_access',
    grant_type: 'code'
  },
  base_url: 'http://localhost:8081',
  wallet_url: 'http://localhost:4200',
  wallet_url_test: 'http://localhost:4200',
  knowledgebase_url: "https://knowledgebase.dome-marketplace-sbx.org/",
  profile: "lcl", //values: 'lcl', 'sbx', 'test', 'production'
  procedures: '/api/v1/procedures',
  save_credential: '/vci/v1/issuances',
  credential_offer_url: '/api/v1/credential-offer',
  notification: '/api/v1/notifications',
  sign_credential_url: '/api/v1/retry-sign-credential',
  customizations:{
    colors:{ 
      primary:'#2d58a7',
      primary_contrast:'#ffffff',
      secondary:'#2cb6b2',
      secondary_contrast:'#dde6f6'
    },
    logo_src:"assets/logos/no-image.png",
    favicon_src:"assets/icon/favicon.png"  
  }
};
