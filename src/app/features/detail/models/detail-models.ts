export type CredentialType = 'LEARCredentialEmployee' | 'LEARCredentialMachine' | 'VerfiableCertification';

export type CredentialStatus = 'WITHDRAWN' | 'VALID' | 'EXPIRED' | 'PEND_DOWNLOAD' | 'PEND_SIGNATURE' | 'DRAFT' | 'ISSUED';

export interface LearCredentialDataDetail {
  procedure_id: string;
  credential_status: CredentialStatus;
  credential: LearCredentialJwtPayload;
}

export interface LearCredentialJwtPayload {
  sub: string | null;
  nbf: string;
  iss: string;
  exp: string;
  iat: string;
  vc: LearCredential;
  jti: string;
}

export type LearCredential =
  | LearCredentialEmployee
  | LearCredentialMachine
  | VerifiableCertification;

// --- Common Types ---
export interface LifeSpan {
  start: string;
  end: string;
}

export interface CommonMandator {
  commonName: string;
  country: string;
  emailAddress: string;
  organization: string;
  organizationIdentifier: string;
  serialNumber: string;
}

export interface Power {
  id: string;
  tmf_action: TmfAction[];
  tmf_domain: string;
  tmf_function: TmfFunction;
  tmf_type: string;
}


export const PowerActionsMap: Record<TmfFunction, TmfAction[]> = {
  OnBoarding: ['Execute'],
  ProductOffering: ['Create', 'Update', 'Delete'],
  Certification: ['Upload', 'Attest']
};

export type TmfFunction = 'OnBoarding' | 'ProductOffering' | 'Certification';
export type TmfAction = 'Execute' | 'Create' | 'Update' | 'Delete' | 'Upload' | 'Attest'


export interface CommonSigner {
  commonName: string;
  country: string;
  emailAddress: string;
  organization: string;
  organizationIdentifier: string;
  serialNumber: string;
}

export interface CommonIssuer {
  id: string;
  organizationIdentifier: string;
  organization: string;
  country: string;
  commonName: string;
  emailAddress: string;
  serialNumber: string;
}

// --- Employee ---
export interface LearCredentialEmployee {
  id: string;
  type: CredentialType[];
  description: string;
  credentialSubject: {
    mandate: {
      id: string;
      life_span: LifeSpan;
      mandatee: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        mobile_phone: string;
        nationality: string;
      };
      mandator: EmployeeMandator;
      power: Power[];
      signer: EmployeeSigner;
    };
  };
  issuer: EmployeeIssuer;
  validFrom: string;
  validUntil: string;
}

export interface EmployeeMandator extends CommonMandator {}
export interface EmployeeSigner extends CommonSigner {}
export interface EmployeeIssuer extends CommonIssuer {}

// --- Machine ---
export interface LearCredentialMachine {
  id: string;
  type: CredentialType[];
  description: string;
  credentialSubject: {
    mandate: {
      id: string;
      life_span: LifeSpan;
      mandatee: {
        id: string;
        serviceName: string;
        serviceType: string;
        version: string;
        domain: string;
        ipAddress: string;
        description: string;
        contact: {
          email: string;
          phone: string;
        };
      };
      mandator: MachineMandator;
      power: Power[];
      signer: MachineSigner;
    };
  };
  issuer: MachineIssuer;
  validFrom: string;
  validUntil: string;
}

export interface MachineMandator extends CommonMandator {}
export interface MachineSigner extends CommonSigner {}
export interface MachineIssuer extends CommonIssuer {}

// --- Certification ---
// todo no té power??
export interface VerifiableCertification {
  id: string;
  type: CredentialType[];
  issuer: CertificationIssuer;
  credentialSubject: {
    company: {
      address: string;
      commonName: string;
      country: string;
      email: string;
      id: string;
      organization: string;
    };
    compliance: {
      id: string;
      hash: string;
      scope: string;
      standard: string;
    }[];
    product: {
      productId: string;
      productName: string;
      productVersion: string;
    };
  };
  validFrom: string;
  atester: Atester;
  validUntil: string;
  signer: CertificationSigner;
}

export interface CertificationIssuer {
  commonName: string;
  country: string;
  id: string;
  organization: string;
}

export interface CertificationSigner {
  commonName: string;
  country: string;
  emailAddress: string;
  organization: string;
  organizationIdentifier: string;
  serialNumber: string;
}

export interface Atester {
  id: string;
  organization: string;
  organizationIdentifier: string;
  firstName: string;
  lastName: string;
  country: string;
}

export type LearCredentialEmployeeFormData = {
  issuer: EmployeeIssuer;
  mandatee: LearCredentialEmployee['credentialSubject']['mandate']['mandatee'];
  mandator: EmployeeMandator;
  power: Power[];
};

export type LearCredentialMachineFormData = {
  issuer: MachineIssuer;
  mandatee: LearCredentialMachine['credentialSubject']['mandate']['mandatee'];
  mandator: MachineMandator;
  power: Power[];
};

export type VerifiableCertificationFormData = {
  issuer: CertificationIssuer;
  company: VerifiableCertification['credentialSubject']['company'];
  product: VerifiableCertification['credentialSubject']['product'];
};

export type FormDataByType = {
  LEARCredentialEmployee: LearCredentialEmployeeFormData;
  LEARCredentialMachine: LearCredentialMachineFormData;
  VerfiableCertification: VerifiableCertificationFormData;
};

export type CredentialFormData<T extends CredentialType = CredentialType> = FormDataByType[T];