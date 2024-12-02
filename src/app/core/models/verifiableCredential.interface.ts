import { CredentialSubject } from "./credentialSubject.interface";

export interface VerifiableCredential {
  id: string;
  type: string[];
  credentialSubject: CredentialSubject;
  expirationDate: string;
  issuanceDate: string;
  issuer: string;
  validFrom: string;
}
