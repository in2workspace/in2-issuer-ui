(function(window) {
    window["env"] = window["env"] || {};

    window["env"]["login_url"] = "http://localhost:9099/realms/wallet";
    window["env"]["client_id"] = "auth-client";
    window["env"]["scope"] = "openid profile email offline_access";
    window["env"]["grant_type"] = "code";
    window["env"]["issuer_url"] = "";
    window["env"]["issuer_uri"] = "";
    window["env"]["wallet_url"] = "https://localhost:4200"
})