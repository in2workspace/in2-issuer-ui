(function(window) {
    window["env"] = window["env"] || {};

    // Environment variables
    window["env"]["login_url"] = "http://localhost:8081";
    window["env"]["client_id"] = "auth-client";
    window["env"]["scope"] = "openid profile email offline_access";
    window["env"]["grant_type"] = "code";
    window["env"]["base_url"] = "https://localhost:8088";
    window["env"]["wallet_url"] = "https://localhost:4200";
  })(this);
