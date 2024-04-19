import { CredentialMandatee } from "./credendentialMandatee.interface";

export interface CredentialManagement {
  id:string;
  status: string;
  name: string;
  updated: string;
  mandatee: CredentialMandatee;
}

