import { Mandator } from "./madator.interface";
import { Mandatee } from "./mandatee.interface";

export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type?: string[];
  issuer: Issuer;
  issuanceDate: string;
  validFrom: string;
  expirationDate: string;
  credentialSubject: CredentialSubject;
  available_formats?: string[];
  format?: string;
  status?: CredentialStatus;
}

export interface Issuer {
  id: string;
}

export interface CredentialSubject {
  mandate: Mandate;
}

export interface Mandate {
  id: string;
  life_span?: LifeSpan;
  mandatee: Mandatee;
  mandator: Mandator;
  power: Power[];
}

export interface Power {
  id: string;
  tmf_type: string;
  tmf_domain: string[];
  tmf_function: string;
  tmf_action: string[];
}

export interface LifeSpan {
  start_date_time?: string;
  end_date_time?: string;
}

export enum CredentialStatus {
  VALID = 'VALID',
  ISSUED = 'ISSUED',
  REVOKED = 'REVOKED'
}
