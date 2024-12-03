import { LearCredentialEmployeePayload } from "./lear-credential-employee-payload.dto";

export interface ProcedureResponse {
  credential_procedures: CredentialProcedure[];
}

export interface CredentialProcedure {
  credential_procedure: {
    procedure_id: string;
    full_name: string;
    status: string;
    updated: string;
    credential: LearCredentialEmployeePayload;
  }
}

