import { CredentialManagement } from "./credentialManagement.interface";
export interface CredentialProcedureEmision {
    schema: string,
    format: string,
    payload: {
        credentialSubject: CredentialManagement
    },
    operationMode: string
  }


