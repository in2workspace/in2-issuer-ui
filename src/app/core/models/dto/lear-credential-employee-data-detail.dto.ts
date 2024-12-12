import { LEARCredentialEmployeeJwtPayload } from "../entity/lear-credential-employee.entity";
import {VerifiableCertificationJwtPayload} from "../entity/verifiable-certification.entity";

export interface CredentialProcedureDetail {
  procedure_id: string;
  credential_status: string;
  credential: LEARCredentialEmployeeJwtPayload | VerifiableCertificationJwtPayload;
}
