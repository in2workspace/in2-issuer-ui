// src/types/global.d.ts

interface Window {
    env: {
        login_url?: string;
        login_realm_path?: string;
        base_url?: string;
        wallet_url?: string;
        wallet_url_test?: string;
        knowledgebase_url?: string;
        profile?: string;
        procedures?: string;
        saveCredential?: string;
        credential_offer_url?: string;
        notification?: string;
        sign_credential_url?: string;
        primary?: string;
        primary_contrast?: string;
        secondary?: string;
        secondary_contrast?: string;
        logo_src?: string;
        favicon_src?: string;
    };
}