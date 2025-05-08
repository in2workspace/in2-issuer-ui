import { EmployeeMandatee, EmployeeMandator, StrictPower } from "../entity/lear-credential-employee.entity";

export interface LearCredentialEmployeePayload {
  mandator: EmployeeMandator;
  mandatee: EmployeeMandatee;
  power: StrictPower[];
}
