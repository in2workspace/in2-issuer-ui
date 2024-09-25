import { CredentialManagement } from "./credentialManagement.interface";
export interface IssuanceRequest {
    schema: string,
    format: string,
    payload:CredentialManagement,
    operation_mode: string
  }


