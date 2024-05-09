import { CredentialMandatee } from "./credendentialMandatee.interface";
import { Power } from 'src/app/core/models/power.interface';
export interface CredentialManagement {
  id:string;
  status: string;
  name: string;
  updated: string;
  mandatee: CredentialMandatee;
  powers: Power[];
}

