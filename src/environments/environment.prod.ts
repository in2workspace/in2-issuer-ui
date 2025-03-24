// todo consider renaming to environment.deployment.ts
export const environment = {
  production: true,
  // todo consider grouping as "url"
    // REQUIRED
    // Consider renaming as "keycloak_external_domain"
    iam_url: window["env"]["iam_url"] || 'https://localhost:8443/realms/CredentialIssuer',
    //? SHOULD BE ADDED?, REQUIRED
    iam_realm_path: window["env"]["iam_realm_path"] || 'realms/issuer',
  // Issuer API base url
  // used as auth module secureRoutes
  // used as credential-procedure requests url
  // Example: https://issuer.dome-marketplace-lcl.org/issuer-api
  // todo consider renaming as server_url
  // REQUIRED
  // todo consider renaming to server_url
  base_url: window["env"]["base_url"] || 'http://localhost:8081',
  // REQUIRED
  // Wallet base url
  // Example: https://wallet.dome-marketplace.org/
  // Currently is configured as the PRD url in all environments
  // used for links in credential-offer and home
  wallet_url: window["env"]["wallet_url"] || 'http://localhost:4200',
  // Wallet base URL shown in credential offer to point to the same environment for test purposes
  // Example (SBX): https://wallet.dome-marketplace-sbx.org/
  // todo Consider renaming such as "wallet_url_environment"?
  // REQUIRED
  wallet_url_test: window["env"]["wallet_url_test"] || 'http://localhost:4200',
  // SHOULD BE ADDED instead of "profile"; rethink naming
  show_wallet_url_test: window["env"]["show_wallet_url_test"] || false,
  // REQUIRED
  // Consider unnesting and renaming to knowledgebase
  knowledge:{
    base_url: window["env"]["knowledgebase_url"] || "https://knowledgebase.dome-marketplace-sbx.org/",
  },
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
    // Consider pointing directly to image (ex.: "no-image.png")
    logo_src: window["env"]["logo_src"] || "assets/logos/no-image.png",
    // OPTIONAL with fallback
    // Consider pointing directly to image (ex.: "favicon.png")
    //todo apply in app.component-index
    favicon_src: window["env"]["favicon_src"] || "assets/icon/favicon.png"  
  }
};
