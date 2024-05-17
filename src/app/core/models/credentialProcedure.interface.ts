import { CredentialManagement } from "./credentialManagement.interface";

export interface CredentialProcedure {
  procedure_id: string;
  name: string;
  status: string;
  updated: string;
  credential: CredentialManagement;
}
