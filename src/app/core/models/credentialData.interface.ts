import {Credential} from "./credential.interface";

export interface CredentialData {
  procedure_id: string;
  credential_status: string;
  credential: Credential;
}
