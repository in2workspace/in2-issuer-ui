(function(window) {
    window["env"] = window["env"] || {};

    // Environment variables
    window["env"]["login_url"] = "https://localhost:8443/realms/CredentialIssuer";
    window["env"]["client_id"] = "account-console";
    window["env"]["scope"] = "openid profile email offline_access";
    window["env"]["grant_type"] = "code";
    window["env"]["base_url"] = "http://localhost:8081";
    window["env"]["wallet_url"] = "https://localhost:4200";
    window["env"]["procedures"] = "/api/v1/procedures";
    window["env"]["save_credential"] = "/api/v1/credentials?type=LEARCredentialEmployee";
    window["env"]["credential_offer_url"] = "/api/v1/credential-offer";
    window["env"]["notification"] = "/api/v1/notifications";
  })(this);
