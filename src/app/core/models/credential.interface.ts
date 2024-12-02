import { VerifiableCredential } from "./verifiableCredential.interface";

export interface Credential {
  sub: string | null;
  nbf: string;
  iss: string;
  exp: string;
  iat: string;
  vc: VerifiableCredential;
  jti: string;
}
