export const environment = {
  production: false,
  loginParams: {
    login_url: 'https://keycloak-dev.ssihub.org/realms/in2-issuer',
    login_realm_path: 'realms/issuer'
  },
  base_url: 'http://localhost:8081',
  wallet_url: 'http://localhost:4200',
  wallet_url_test: 'http://localhost:4200',
  knowledge:{
    base_url: "https://knowledgebase.dome-marketplace-sbx.org/",
  } ,
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
    logo_src:"assets/logos/logo-dome-issuer-reduced.png",
    favicon_src:"assets/icon/favicon.png"  
  }
};
