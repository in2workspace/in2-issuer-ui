import { CredentialManagement } from "./credentialManagement.interface";
import { CredentialMandatee } from "./credendentialMandatee.interface";
import { Mandator } from "./madator.interface";
import { Power } from "./power.interface";
export interface CredentialProcedure {
  credential_procedure: {
    procedure_id: string;
  full_name: string;
  status: string;
  updated: string;
  credential: CredentialManagement;}

}

export interface CredentialProcedureResponse {
  credential_procedures: CredentialProcedure[];
}

export interface LifeSpan {
  end_date_time: string;
  start_date_time: string;
}

export interface Mandate {
  id: string;
  life_span: LifeSpan;
  mandatee: CredentialMandatee;
  mandator: Mandator;
  power: Power[];
}
export interface Signer {
  commonName: string;
  country: string;
  emailAddress: string;
  organization: string;
  organizationIdentifier: string;
  serialNumber: string;
}


export interface CredentialSubject {
  mandate: Mandate;
}

export interface VerifiableCredential {
  id: string;
  type: string[];
  credentialSubject: CredentialSubject;
  expirationDate: string;
  issuanceDate: string;
  issuer: string;
  validFrom: string;
}

export interface Credential {
  sub: string | null;
  nbf: string;
  iss: string;
  exp: string;
  iat: string;
  vc: VerifiableCredential;
  jti: string;
}

export interface CredentialData {
  procedure_id: string;
  credential_status: string;
  credential: Credential;
}
