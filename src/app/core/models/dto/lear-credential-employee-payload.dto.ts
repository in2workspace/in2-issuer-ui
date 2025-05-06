import { EmployeeMandatee, EmployeeMandator, Power } from "../entity/lear-credential-employee.entity";

export interface LearCredentialEmployeePayload {
  mandator: EmployeeMandator;
  mandatee: EmployeeMandatee;
  power: Power[];
}
