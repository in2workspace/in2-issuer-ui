export const environment = {
  production: false,
  loginParams: {
    login_url: 'https://keycloak-dev.ssihub.org/realms/in2-issuer',
    client_id: 'vc-auth-client',
    scope: 'openid profile email offline_access',
    grant_type: 'code'
  },
  base_url: 'http://localhost:8081',
  wallet_url: 'http://localhost:4200',
  wallet_url_test: 'http://localhost:4200',
  knowledge:{
    base_url: "https://knowledgebase.dome-marketplace-sbx.org/",
    wallet_path: "books/dome-digital-wallet-user-guide"
  } ,
  profile: "lcl", //values: 'lcl', 'sbx', 'test', 'production'
  procedures: '/api/v1/procedures',
  save_credential: '/vci/v1/issuances',
  credential_offer_url: '/api/v1/credential-offer',
  notification: '/api/v1/notifications',
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
  //firma_credential: '/api/v1/sign-credential' The`firma_credential` variable has been commented out as it was initially intended for the signature functionality,which remains incomplete. This configuration is currently unnecessary for the existing flows but is expected to be reintroduced in the future when the related use case is implemented.
};
