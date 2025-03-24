(function(window) {
  window.env = window.env || {};

  // Environment variables
  //todo external env var has to be changed in Helm
  window["env"]["iam_url"] = "${IAM_EXTERNAL_DOMAIN}";
  //todo external env var has to be changed in Helm
  window["env"]["iam_realm_path"] = "${IAM_REALM_PATH}";
  window["env"]["server_url"] = "${BASE_URL}";
  window["env"]["wallet_url"] = "${WALLET_URL}";
  window["env"]["wallet_url_test"] = "${WALLET_URL_TEST}";
  window["env"]["knowledgebase_url"] = "${KNOWLEDGEBASE_URL}";
  window["env"]["show_wallet_url_test"] = "${SHOW_WALLET_URL_TEST}";
  window["env"]["primary"] = "${PRIMARY}";
  window["env"]["primary_contrast"]= "${PRIMARY_CONTRAST}";
  window["env"]["secondary"] = "${SECONDARY}";
  window["env"]["secondary_contrast"]= "${SECONDARY_CONTRAST}"
  window["env"]["logo_src"]= "${LOGO_SRC}"
  window["env"]["favicon_src"]= "${FAVICON_SRC}"
})(this);
