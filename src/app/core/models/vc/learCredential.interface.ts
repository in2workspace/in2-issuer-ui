export interface CredentialData {
  procedure_id: string;
  credential_status: string;
  credential: LEARCredential;
}

export interface LEARCredential {
  sub: string | null;
  nbf: string;
  iss: string;
  exp: string;
  iat: string;
  vc: VerifiableCredential;
  jti: string;
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

export interface CredentialSubject {
  mandate: Mandate;
}

export interface Mandate {
  id: string;
  life_span: LifeSpan;
  mandatee: Mandatee;
  mandator: Mandator;
  power: Power[];
}

export interface LifeSpan {
  end_date_time: string;
  start_date_time: string;
}

export interface Mandatee {
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone?: string;
}

export interface OrganizationDetails {
  organizationIdentifier: string;
  organization: string;
  commonName: string;
  emailAddress: string;
  serialNumber: string;
  country: string;
}

export interface Mandator extends OrganizationDetails {}

export interface Signer extends OrganizationDetails {}

export interface Power {
  tmf_action: string | string[];
  tmf_domain: string;
  tmf_function: string;
  tmf_type: string;
}
