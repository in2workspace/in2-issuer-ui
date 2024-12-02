
import { CredentialMandatee } from "./credendentialMandatee.interface";
import { Power } from "./power.interface";
import {Mandator} from "./mandator.interface";
import {Signer} from "./signer.interface";


export interface CredentialManagement {
  mandator: Mandator;
  mandatee: CredentialMandatee;
  signer: Signer;
  power: Power[];
}


