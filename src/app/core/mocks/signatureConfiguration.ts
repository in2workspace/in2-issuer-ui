export const issuerConfiguration={
    "enableRemoteSignature": "true",
    "signatureMode": "CLOUD"
}


export const providersMock=[
    {
        "id": "f0a0ee81-b785-4230-9b4b-4e0e59609e21",
        "provider": "provider1",
        "url": "www.prueba2.com",
        "authMethod": "Oauth2",
        "authGrantType": "clientCredentials.",
        "requiresTOTP": true
    },
    {
        "id": "7521f592-e72b-4839-aeea-89255337b7b0",
        "provider": "prueba2",
        "url": "www.prueba2.com",
        "authMethod": "Oauth2",
        "authGrantType": "clientCredentials.",
        "requiresTOTP": true
    },
    {
        "id": "d2281001-a757-411d-91f5-ce16ddcd2bee",
        "provider": "DIGITEL",
        "url": "www.digitel.com",
        "authMethod": "Oauth2",
        "authGrantType": "clientCredentials.",
        "requiresTOTP": false
    }
]

export const signatureConfigurationCloud=[
    {
        "id": "7521f592-e72b-4839-aeea-89255337b7b0",
        "organizationIdentifier": "VATES-B60645900",
        "enableRemoteSignature": true,
        "signatureMode": "CLOUD",
        "cloudProviderName": "DIGITEL",
        "clientId": "mi-cliente",
        "credentialId": "cred-001",
        "credentialName": "Nueva prueba"
    },
    {
        "id": "cef9430d-0572-4c11-8f88-61ea3dd95b13",
        "organizationIdentifier": "VATES-B60645900",
        "enableRemoteSignature": true,
        "signatureMode": "CLOUD",
        "cloudProviderName": "DIGITEL",
        "clientId": "mi-cliente",
        "credentialId": "cred-001",
        "credentialName": "PRUEBA 2"
    },
    {
        "id": "32ec0c8c-5a1d-4546-b8fd-2052ba969a8d",
        "organizationIdentifier": "VATES-B60645900",
        "enableRemoteSignature": true,
        "signatureMode": "CLOUD",
        "cloudProviderName": "DIGITEL",
        "clientId": "mi-cliente",
        "credentialId": "cred-001",
        "credentialName": "NEW CREDENTIAL"
    }
]