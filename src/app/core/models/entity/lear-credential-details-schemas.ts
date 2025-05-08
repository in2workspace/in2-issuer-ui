// --- Form Schemas ---

export type CredentialDetailsFormFieldSchema = {
    type: 'control' | 'group';
    display?: 'main' | 'side'; //should it be displayed in the main space or as a side card?
    fields?: CredentialDetailsFormSchema; //for 'group'
  };
  
export type CredentialDetailsFormSchema = Record<string, CredentialDetailsFormFieldSchema>;
  
//todo model de cada form schema?
export const LearCredentialEmployeeDetailsFormSchema: CredentialDetailsFormSchema = {
    mandatee: {
      type: 'group',
      display: 'main',
      fields: {
        // id: { type: 'control' },
        firstName: { type: 'control' },
        lastName: { type: 'control' },
        email: { type: 'control' },
        // mobile_phone: { type: 'control' },
        nationality: { type: 'control' },
      },
    },
    mandator: {
      type: 'group',
      display: 'side',
      fields: {
        commonName: { type: 'control' },
        emailAddress: { type: 'control' },
        serialNumber: { type: 'control' },
        organization: { type: 'control' },
        organizationIdentifier: { type: 'control' },
        country: { type: 'control' },
      },
    },
    issuer: {
      type: 'group',
      display: 'side',
      fields: {
        id: { type: 'control' },
        organizationIdentifier: { type: 'control'},
        organization: { type: 'control' },
        country: { type: 'control' },
        commonName: { type: 'control' },
        emailAddress: { type: 'control' },
        serialNumber: { type: 'control' }
      },
    },
    power: {
      type: 'group',
      display: 'main',
      //will be set dynamically
    },
  };
  
  //todo decidir camps i ordre
  export const LearCredentialMachineDetailsFormSchema: CredentialDetailsFormSchema = {
    mandatee: {
      type: 'group',
      display: 'main',
      fields: {
        id: { type: 'control' },
        serviceName: { type: 'control' },
        serviceType: { type: 'control' },
        version: { type: 'control' },
        domain: { type: 'control' },
        ipAddress: { type: 'control' },
        description: { type: 'control' },
        contact: {
          type: 'group',
          fields: {
            email: { type: 'control' },
            phone: { type: 'control' },
          },
        },
      },
    },
    mandator: {
      type: 'group',
      display: 'side',
      fields: {
        commonName: { type: 'control' },
        country: { type: 'control' },
        emailAddress: { type: 'control' },
        organization: { type: 'control' },
        organizationIdentifier: { type: 'control' },
        serialNumber: { type: 'control' },
      },
    },
    issuer: {
      type: 'group',
      display: 'side',
      fields: {
        // id: { type: 'control' },
        organizationIdentifier: { type: 'control'},
        organization: { type: 'control' },
        country: { type: 'control' },
        commonName: { type: 'control' },
        emailAddress: { type: 'control' },
        serialNumber: { type: 'control' }
      },
    },
    power: {
      type: 'group',
      display: 'main',
      //will be set dynamically
    },
  };
  
  //todo decidir camps i ordre (--compliance)
  export const VerifiableCertificationDetailsFormSchema: CredentialDetailsFormSchema = {
    issuer: {
      type: 'group',
      display: 'side',
      fields: {
        id: { type: 'control' },
        commonName: { type: 'control' },
        country: { type: 'control' },
        organization: { type: 'control' },
      },
    },
    attester: {
      type: 'group',
      display: 'side',
      fields: {
        id: { type: 'control' },
        firstName: { type: 'control' },
        lastName: { type: 'control' },
        country: { type: 'control' },
        organization: { type: 'control' },
        organizationIdentifier: { type: 'control' },
      }
    },
    company: {
      type: 'group',
      display: 'main',
      fields: {
        id: { type: 'control' },
        commonName: { type: 'control' },
        organization: { type: 'control' },
        country: { type: 'control' },
        email: { type: 'control' },
        address: { type: 'control' },
      },
    },
    product: {
      type: 'group',
      display: 'main',
      fields: {
        productId: { type: 'control' },
        productName: { type: 'control' },
        productVersion: { type: 'control' },
      },
    },
    compliance: {
      type: 'group',
      display: 'main',
      fields: {} //it is dynamically buiolt in buildFormFromSchema
    },
  };