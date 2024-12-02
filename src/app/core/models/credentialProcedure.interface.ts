import { CredentialManagement } from "./credentialManagement.interface";

export interface CredentialProcedure {
  credential_procedure: {
    procedure_id: string;
    full_name: string;
    status: string;
    updated: string;
    credential: CredentialManagement;
  }
}
