
import { CredentialMandatee } from "./credendentialMandatee.interface";
import { Mandator } from "./madator.interface";
import { Power } from "./power.interface";

export interface CredentialManagement {
  id: string;
  status: string;
  name: string;
  updated: string;
  mandator: Mandator;
  mandatee: CredentialMandatee;
  powers: Power[];
}
