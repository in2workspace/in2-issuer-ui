import { PowerInstance } from "./power";

export const CREDENTIAL_SCHEMAS: Record<CredentialType, Credential> = {
  employee: {
    type: 'employee',
    mandatee: {
      name: { type: 'string', validators: [] },
      surname: { type: 'string', validators: [] },
      email: { type: 'email', validators: [] },
    },
    mandator: {
      name: { type: 'string', validators: [] },
      surname: { type: 'string', validators: [] },
      email: { type: 'email', validators: [] },
    },
    signer: {
      name: { type: 'string', validators: [] },
      surname: { type: 'string', validators: [] },
      email: { type: 'email', validators: [] },
    },
    powers: [
      {
        name: 'onboarding',
        functions: {
          login: false,
        },
      },
      {
        name: 'productOffering',
        functions: {
          create: false,
          delete: false,
        },
      },
    ],
  },
  machine: {
    type: 'machine',
    mandatee: {
      name: { type: 'string', validators: [] },
      surname: { type: 'string', validators: [] },
      email: { type: 'email', validators: [] },
    },
    mandator: {
      name: { type: 'string', validators: [] },
      surname: { type: 'string', validators: [] },
      email: { type: 'email', validators: [] },
    },
    signer: {
      name: { type: 'string', validators: [] },
      surname: { type: 'string', validators: [] },
      email: { type: 'email', validators: [] },
    },
    powers: [
      {
        name: 'onboarding',
        functions: {
          login: false,
          unlog: false,
        },
      },
      {
        name: 'productOffering',
        functions: {
          create: false,
          update: false,
        },
      },
    ],
  },
  certification: {
    type: 'certification',
    signer: {
      name: { type: 'string', validators: [] },
      surname: { type: 'string', validators: [] },
      email: { type: 'email', validators: [] },
    },
    powers: [
      {
        name: 'onboarding',
        functions: {
          login: false,
        },
      },
      {
        name: 'certification',
        functions: {
          attest: false,
          certificate: false,
        },
      },
    ],
  },
};

export type CredentialType = 'employee' | 'machine' | 'certification';

export type Credential = {
  type: CredentialType;
  mandatee?: Mandatee;
  mandator?: Mandator;
  signer: Signer;
  powers: PowerInstance[];
};

export type Mandatee = {
  name: { type: 'string'; validators: IssuerValidators[] };
  surname: { type: 'string'; validators: IssuerValidators[] };
  email: { type: 'email'; validators: IssuerValidators[] };
};

export type Mandator = {
  name: { type: 'string'; validators: IssuerValidators[] };
  surname: { type: 'string'; validators: IssuerValidators[] };
  email: { type: 'email'; validators: IssuerValidators[] };
};

export type Signer = {
  name: { type: 'string'; validators: IssuerValidators[] };
  surname: { type: 'string'; validators: IssuerValidators[] };
  email: { type: 'email'; validators: IssuerValidators[] };
};

// ToDo: defineix validators més endavant
export type IssuerValidators = any;
