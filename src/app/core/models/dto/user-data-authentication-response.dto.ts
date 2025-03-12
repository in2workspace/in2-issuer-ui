import { LEARCredentialEmployee } from "../entity/lear-credential-employee.entity";
import {RolType } from '../enums/auth-rol-type.enum'
export interface UserDataAuthenticationResponse {
  sub: string;
  commonName: string;
  country: string;
  serialNumber: string;
  email_verified: boolean;
  preferred_username: string;
  given_name: string;
  "tenant-id": string;
  emailAddress: string;
  organizationIdentifier: string;
  organization: string;
  name: string;
  family_name: string;
  serial_number?:string;
  email?:string
  rol?: RolType;
  vc?: LEARCredentialEmployee;
}
