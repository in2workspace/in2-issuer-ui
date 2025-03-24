// this template is used for deployment in all environments (LCL, SBX, Dev2 and PRD)

export const environment = {
  production: true,
  // Keycloak URL (REQUIRED) 
  iam_url: window["env"]["iam_url"],
  // Keycloak realm path (REQUIRED)
  // todo TO BE ADDED --> currently it is included in iam_url
  iam_realm_path: window["env"]["iam_realm_path"],
  // Issuer API base URL (REQUIRED)
  server_url: window["env"]["server_url"],
  // Wallet base URL; currently points to PRD (REQUIRED)
  wallet_url: window["env"]["wallet_url"],
  // Wallet URL used for testing in non-PRD environments (REQUIRED)
  //? required or optional?
  wallet_url_test: window["env"]["wallet_url_test"],
  // Defines whether link to wallet_test_url is shown (REQUIRED)
  //? required or optional?
  show_wallet_url_test: window["env"]["show_wallet_url_test"] || false,
  // Knowledgebase base URL (REQUIRED)
  knowledgebase_url: window["env"]["knowledgebase_url"],
  customizations:{
    colors:{ 
      // (OPTIONAL with fallback)
      primary: window["env"]["primary"] ?? '#2d58a7',
      // (OPTIONAL with fallback)
      primary_contrast: window["env"]["primary_contrast"] || '#ffffff',
      // (OPTIONAL with fallback)
      secondary: window["env"]["secondary"] || '#2cb6b2',
      // (OPTIONAL with fallback)
      secondary_contrast: window["env"]["secondary_contrast"] || '#dde6f6',
    },
    // Main app logo name, shown in the navbar. Points to "assets/logos/" (REQUIRED)
    logo_src: window["env"]["logo_src"],
    // App favicon. Points to "assets/icons/" (OPTIONAL with fallback)
    favicon_src: window["env"]["favicon_src"] || "assets/icons/favicon.png"  
  }
};
