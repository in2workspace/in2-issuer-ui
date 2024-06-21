
import { CredentialMandatee } from "./credendentialMandatee.interface";
import { Mandator } from "./madator.interface";
import { Power } from "./power.interface";


export interface CredentialManagement {
  mandator: Mandator;
  mandatee: CredentialMandatee;
  power: Power[];
}


