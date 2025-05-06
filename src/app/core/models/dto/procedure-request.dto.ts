import { LearCredentialEmployeePayload } from "./lear-credential-employee-payload.dto";

export interface EmployeeProcedureRequest {
    schema: string,
    format: string,
    payload: LearCredentialEmployeePayload,
    operation_mode: string,
    validity_period?: number,
    response_uri?: string
}

