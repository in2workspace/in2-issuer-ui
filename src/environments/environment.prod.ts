export const environment = {
  production: true,
  loginParams: {
    // CONSTANT
    // client_id: window["env"]["client_id"] || 'account-console',
    // CONSTANT
    // scope: window["env"]["scope"] || 'openid profile email offline_access',
    // CONSTANT
    // grant_type: window["env"]["grant_type"] || 'code',
    // REQUIRED
    login_url: window["env"]["login_url"] || 'https://localhost:8443/realms/CredentialIssuer'
    // SHOULD BE ADDED, REQUIRED
    // login_realm_path: window["env"]["login_realm_path"] || 'realms/issuer'
  },
  // Issuer API base url
  // used as auth module secureRoutes
  // used as credential-procedure requests url
  // Example: https://issuer.dome-marketplace-lcl.org/issuer-api
  // REQUIRED
  base_url: window["env"]["base_url"] || 'http://localhost:8081',
  // Wallet base url
  // Example: https://wallet.dome-marketplace.org/
  // It is configured as the PRD
  // used for links in credential-offer and home
  // REQUIRED
  wallet_url: window["env"]["wallet_url"] || 'http://localhost:4200',
  // Wallet base URL shown in credential offer to point to the same environment for test purposes
  // Example (SBX): https://wallet.dome-marketplace-sbx.org/
  // Maybe rename such as "wallet_url_environment"?
  // REQUIRED
  wallet_url_test: window["env"]["wallet_url_test"] || 'http://localhost:4200',
  // REQUIRED
  knowledge:{
    base_url: window["env"]["knowledgebase_url"] || "https://knowledgebase.dome-marketplace-sbx.org/",
    // Should be a CONSTANT
    wallet_path: ["env"]["knowledge_wallet_path"] || "books/dome-digital-wallet-user-guide"
  },
  // REMOVE per ser coherents amb altres apps i backend, s'hauria d'eliminar; 
  profile: window["env"]["profile"] || "lcl", //values: 'lcl', 'sbx', 'test', 'production'
  // SHOULD BE ADDED instead of "profile"; rethink naming
  // show_wallet_url_test: window["env"]["show_wallet_url_test"] || false,
  // CONSTANT
  procedures: window["env"]["procedures"] || '/api/v1/procedures',
  // CONSTANT
  save_credential: window["env"]["saveCredential"] || '/vci/v1/issuances',
  // CONSTANT
  credential_offer_url: window["env"]["credential_offer_url"] || '/api/v1/credential-offer',
  // CONSTANT
  notification: window["env"]["notification"] || '/api/v1/notifications',
  // CONSTANT
  sign_credential_url: window["env"]["sign_credential_url"] || '/api/v1/retry-sign-credential',
  customizations:{
    colors:{ 
      // OPTIONAL with fallback
      primary: window["env"]["primary"] ?? '#2d58a7',
      // OPTIONAL with fallback
      primary_contrast: window["env"]["primary_contrast"] || '#ffffff',
      // OPTIONAL with fallback
      secondary: window["env"]["secondary"] || '#2cb6b2',
      // OPTIONAL with fallback
      secondary_contrast: window["env"]["secondary_contrast"] || '#dde6f6',
    },
    // REQUIRED
    logo_src: window["env"]["logo_src"] || "assets/logos/no-image.png",
    // OPTIONAL with fallback
    favicon_src: window["env"]["favicon_src"] || "assets/icon/favicon.png"  
  }
};
