import { CredentialMandatee } from "./credendentialMandatee.interface";
import { Power } from 'src/app/core/models/power.interface';
import { Mandator } from "./madator.interface";
export interface CredentialManagement {
  id:string;
  mandator: Mandator;
  mandatee: CredentialMandatee;
  powers: Power[];
}

