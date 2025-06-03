export const IAM_PARAMS = Object.freeze({
    CLIENT_ID: "vc-auth-client",
    SCOPE: "openid profile email offline_access learcredential role",
    GRANT_TYPE: "code"
});

export const IAM_POST_LOGOUT_URI = window.location.origin;
export const IAM_POST_LOGIN_ROUTE = '/organization/credentials';
export const IAM_REDIRECT_URI = `${window.location.origin}`;