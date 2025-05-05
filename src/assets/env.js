(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["iam_url"] = "${IAM_URL}";
  window["env"]["server_url"] = "${BASE_URL}";
  window["env"]["wallet_url"] = "${WALLET_URL}";
  window["env"]["knowledge_base_url"] = "${KNOWLEDGE_BASE_URL}";
  window["env"]["primary"] = "${PRIMARY}";
  window["env"]["primary_contrast"]= "${PRIMARY_CONTRAST}";
  window["env"]["secondary"] = "${SECONDARY}";
  window["env"]["secondary_contrast"]= "${SECONDARY_CONTRAST}";
  window["env"]["logo_src"]= "${LOGO_SRC}"
  window["env"]["favicon_src"]= "${FAVICON_SRC}"

})(this);
