export interface VerifiableCertificationJwtPayload {
  sub: string;
  nbf: number;
  iss: string;
  exp: number;
  iat: number;
  vc: VerifiableCertification;
  jti: string;
}

export interface VerifiableCertification {
  "@context": string[];
  id: string;
  type: string[];
  issuer: Issuer;
  credentialSubject: CredentialSubject;
  validFrom: string;
  validUntil: string;
  signer: Signer;
}

export interface Issuer {
  commonName: string;
  country: string;
  id: string;
  organization: string;
}

export interface CredentialSubject {
  company: Company;
  compliance: Compliance[];
  product: Product;
}

export interface Company {
  address: string;
  commonName: string;
  country: string;
  email: string;
  id: string;
  organization: string;
}

export interface Compliance {
  id: string;
  scope: string;
  standard: string;
}

export interface Product {
  productId: string;
  productName: string;
  productVersion: string;
}

export interface Signer {
  commonName: string;
  country: string;
  emailAddress: string;
  organization: string;
  organizationIdentifier: string;
  serialNumber: string;
}
