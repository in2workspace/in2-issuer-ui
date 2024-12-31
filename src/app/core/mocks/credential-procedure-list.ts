import { CredentialProcedure } from "../models/dto/procedure-response.dto";

export const credentialProcedureListMock: CredentialProcedure[] =[  
    {
        credential_procedure: {
            procedure_id: "aaa",
            full_name: "AAAAAAAAAAAAA BBBBBBB",
            status: "ISSUED",
            updated: "2024-11-25T14:35:45.123+01:00",
            credential: {} as any
        }
    },
    {
        credential_procedure: {
            procedure_id: "aaa",
            full_name: "BBBBBBBBBBBBB CCCCCCCCCCCCCcc",
            status: "PEND_DOWNLOAD",
            updated: "2024-11-26T14:35:45.123+01:00",
            credential: {} as any
        }
    },
]