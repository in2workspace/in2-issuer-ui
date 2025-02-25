import { Mandatee, Mandator, Power } from "../entity/lear-credential-employee.entity";

export interface LearCredentialEmployeePayload {
  mandator: Mandator;
  mandatee: Mandatee;
  power: Power[];
}
