// src/types/global.d.ts

interface Window {
    env: {
        iam_url?: string;
        iam_realm_path?: string;
        base_url?: string;
        wallet_url?: string;
        wallet_url_test?: string;
        knowledgebase_url?: string;
        show_wallet_url_test: boolean;
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