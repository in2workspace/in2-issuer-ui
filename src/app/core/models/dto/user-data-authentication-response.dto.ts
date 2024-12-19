import { LEARCredentialEmployee } from "../entity/lear-credential-employee.entity";

export interface UserDataAuthenticationResponse {
  sub: string;
  commonName: string;
  country: string;
  serialNumber: string;
  email_verified: boolean;
  preferred_username: string;
  given_name: string;
  vc: LEARCredentialEmployee;
  "tenant-id": string;
  emailAddress: string;
  organizationIdentifier: string;
  organization: string;
  name: string;
  family_name: string;
}
