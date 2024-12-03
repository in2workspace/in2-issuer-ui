import { Mandatee, Mandator, Power, Signer } from "../vc/learCredential.interface";

export interface ProcedureRequest {
    schema: string,
    format: string,
    payload: CredentialManagement,
    operation_mode: string,
    validity_period?: number,
    response_uri?: string
}

export interface CredentialManagement {
  mandator: Mandator;
  mandatee: Mandatee;
  signer: Signer;
  power: Power[];
}


