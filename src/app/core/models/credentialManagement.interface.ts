
import { CredentialMandatee } from "./credendentialMandatee.interface";
import { Mandator } from "./madator.interface";
import { Power } from "./power.interface";
import { Signer } from "./credentialProcedure.interface";


export interface CredentialManagement {
  mandator: Mandator;
  mandatee: CredentialMandatee;
  signer: Signer;
  power: Power[];
}


