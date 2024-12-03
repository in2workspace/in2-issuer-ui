import { Mandatee, Mandator, Power, Signer } from "../entity/lear-credential-employee.entity";

export interface LearCredentialEmployeePayload {
  mandator: Mandator;
  mandatee: Mandatee;
  signer: Signer;
  power: Power[];
}
