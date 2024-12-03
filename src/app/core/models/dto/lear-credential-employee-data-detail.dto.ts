import { LEARCredentialEmployee } from "../entity/lear-credential-employee.entity";

export interface LearCredentialEmployeeDataDetail {
  procedure_id: string;
  credential_status: string;
  credential: LEARCredentialEmployee;
}
