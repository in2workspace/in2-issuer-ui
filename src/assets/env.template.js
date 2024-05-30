(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["login_url"] = "${login_url}";
  window["env"]["client_id"] = "${CLIENT_ID}";
  window["env"]["scope"] = "${SCOPE}";
  window["env"]["grant_type"] = "${GRANT_TYPE}";
  window["env"]["base_url"] = "${base_url}";
  window["env"]["wallet_url"] = "${wallet_url}";
  window["env"]["api_base_url"] = "${api_base_url}";
  window["env"]["credential_offer_url"] = "${credential_offer_url}";
  window["env"]["procedures_path"] = "${procedures_path}";
})(this);
