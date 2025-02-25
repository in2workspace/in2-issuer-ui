export interface LEARCredentialEmployeeJwtPayload {
  sub: string | null;
  nbf: string;
  iss: string;
  exp: string;
  iat: string;
  vc: LEARCredentialEmployee;
  jti: string;
}

export interface LEARCredentialEmployee {
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
  signer: Signer;
  power: Power[];
}

export interface LifeSpan {
  end_date_time: string;
  start_date_time: string;
}

export interface Mandatee {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
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
  action: string | string[];
  domain: string;
  function: string;
  type: string;
}
