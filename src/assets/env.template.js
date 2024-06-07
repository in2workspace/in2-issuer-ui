(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["login_url"] = "${login_url}";
  window["env"]["client_id"] = "${client_id}";
  window["env"]["scope"] = "${scope}";
  window["env"]["grant_type"] = "${grant_type}";
  window["env"]["base_url"] = "${base_url}";
  window["env"]["wallet_url"] = "${wallet_url}";
  window["env"]["procedures"] = "${procedures}";
  window["env"]["save_credential"] = "${save_credential}";
  window["env"]["credential_offer_url"] = "${credential_offer_url}";
  window["env"]["notification"] = "${notification}";
})(this);
