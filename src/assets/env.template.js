(function(window) {
    window.env = window.env || {};

    window["env"]["login_url"] = "${LOGIN_URL}";
    window["env"]["client_id"] = "${CLIENT_ID}";
    window["env"]["scope"] = "${SCOPE}";
    window["env"]["grant_type"] = "${GRANT_TYPE}";
    window["env"]["issuer_url"] = "${ISSUER_URL}";
    window["env"]["issuer_uri"] = "${ISSUER_URI}";
})