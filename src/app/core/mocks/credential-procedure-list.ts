import { CredentialProcedure } from "../models/dto/procedure-response.dto";

export const credentialProcedureListMock: CredentialProcedure[] =[
    {
        credential_procedure: {
            procedure_id: "aaa",
            subject: "AAAAAAAAAAAAA BBBBBBB",
            status: "ISSUED",
            credential_type: "LEARCredentialEmployee",
            updated: "2024-11-25T14:35:45.123+01:00"
        }
    },
    {
        credential_procedure: {
            procedure_id: "aaa",
            subject: "BBBBBBBBBBBBB CCCCCCCCCCCCCcc",
            status: "PEND_DOWNLOAD",
            credential_type: "VerifiableCertification",
            updated: "2024-11-26T14:35:45.123+01:00"
        }
    },
]
