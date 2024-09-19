import { CredentialManagement } from "./credentialManagement.interface";
export interface CredentialProcedureEmision {
    schema: string,
    format: string,
    payload:CredentialManagement,
    operation_mode: string
  }


