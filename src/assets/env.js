(function(window) {
    window["env"] = window["env"] || {};

    // Environment variables
    window["env"]["login_url"] = "http://localhost:8082";
    window["env"]["client_id"] = "auth-client";
    window["env"]["scope"] = "openid profile email offline_access";
    window["env"]["grant_type"] = "code";
    window["env"]["base_url"] = "https://localhost:8071";
    window["env"]["wallet_url"] = "https://localhost:4200";
    window["env"]["api_base_url"] = "/api/v1/credentials?type=LEARCredentialEmployee";
    window["env"]["credential_offer_url"] = "/api/v1/credential-offer";
  })(this);
