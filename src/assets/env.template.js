(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["login_url"] = "${LOGIN_URL}";
  window["env"]["client_id"] = "${CLIENT_ID}";
  window["env"]["scope"] = "${SCOPE}";
  window["env"]["grant_type"] = "${GRANT_TYPE}";
  window["env"]["base_url"] = "${BASE_URL}";
  window["env"]["wallet_url"] = "${WALLET_URL}";
  window["env"]["wallet_url_test"] = "${WALLET_URL_TEST}";
  window["env"]["knowledgebase_url"] = "${KNOWLEDGEBASE_URL}";
  window["env"]["profile"] = "${PROFILE}"; //values: 'lcl', 'sbx', 'test', 'production'
  window["env"]["procedures"] = "${PROCEDURES}";
  window["env"]["save_credential"] = "${SAVE_CREDENTIAL}";
  window["env"]["credential_offer_url"] = "${CREDENTIAL_OFFER_URI}";
  window["env"]["notification"] = "${NOTIFICATION}";
  window["env"]["primary"] = "${PRIMARY}";
  window["env"]["primary_contrast"]= "${PRIMARY_CONTRAST}";
  window["env"]["secondary"] = "${SECONDARY}";
  window["env"]["secondary_contrast"]= "${SECONDARY_CONTRAST}"
  window["env"]["logo_src"]= "${LOGO_SRC}"
  //window["env"]["firma_credential"] = "${FIRMA_CREDENTIAL}"; The`firma_credential` variable has been commented out as it was initially intended for the signature functionality,which remains incomplete. This configuration is currently unnecessary for the existing flows but is expected to be reintroduced in the future when the related use case is implemented.

})(this);
