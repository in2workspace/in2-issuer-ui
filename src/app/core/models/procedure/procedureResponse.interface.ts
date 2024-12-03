import { CredentialManagement } from "./procedureRequest.interface";

export interface ProcedureResponse {
  credential_procedures: CredentialProcedure[];
}

export interface CredentialProcedure {
  credential_procedure: {
    procedure_id: string;
    full_name: string;
    status: string;
    updated: string;
    credential: CredentialManagement;
  }
}

