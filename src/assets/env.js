(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["login_url"] = "${LOGIN_URL}";
  window["env"]["login_realm_paht"] = "${LOGIN_REALM_PATH}";
  window["env"]["base_url"] = "${BASE_URL}";
  window["env"]["wallet_url"] = "${WALLET_URL}";
  window["env"]["wallet_url_test"] = "${WALLET_URL_TEST}";
  window["env"]["knowledgebase_url"] = "${KNOWLEDGEBASE_URL}";
  window["env"]["profile"] = "${PROFILE}"; //values: 'lcl', 'sbx', 'test', 'production'
  window["env"]["procedures"] = "${PROCEDURES}";
  window["env"]["save_credential"] = "${SAVE_CREDENTIAL}";
  window["env"]["credential_offer_url"] = "${CREDENTIAL_OFFER_URI}";
  window["env"]["notification"] = "${NOTIFICATION}";
  window["env"]["sign_credential_url"]= "${SIGN_CREDENTIAL_URL}"
  window["env"]["primary"] = "${PRIMARY}";
  window["env"]["primary_contrast"]= "${PRIMARY_CONTRAST}";
  window["env"]["secondary"] = "${SECONDARY}";
  window["env"]["secondary_contrast"]= "${SECONDARY_CONTRAST}";
  window["env"]["logo_src"]= "${LOGO_SRC}"
  window["env"]["favicon_src"]= "${FAVICON_SRC}"

})(this);
