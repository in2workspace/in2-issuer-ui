(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["login_url"] = "${login_url}";
  window["env"]["client_id"] = "${CLIENT_ID}";
  window["env"]["scope"] = "${SCOPE}";
  window["env"]["grant_type"] = "${GRANT_TYPE}";
  window["env"]["base_url"] = "${base_url}";
  window["env"]["wallet_url"] = "${wallet_url}";
})(this);
