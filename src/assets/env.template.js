(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["login_url"] = "${LOGIN_URL}";
  window["env"]["client_id"] = "${CLIENT_ID}";
  window["env"]["scope"] = "${SCOPE}";
  window["env"]["grant_type"] = "${GRANT_TYPE}";
  window["env"]["base_url"] = "${BASE_URL}";
  window["env"]["wallet_url"] = "${WALLET_URL}";
  window["env"]["procedures"] = "${PROCEDURES}";
  window["env"]["save_credential"] = "${SAVE_CREDENTIAL}";
  window["env"]["credential_offer_url"] = "${CREDENTIAL_OFFER_URI}";
  window["env"]["notification"] = "${NOTIFICATION}";
  window["env"]["firma_credential"] = "${FIRMA_CREDENTIAL}";

})(this);
