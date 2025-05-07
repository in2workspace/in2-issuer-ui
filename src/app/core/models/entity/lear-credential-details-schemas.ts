// --- Form Schemas ---

export type CredentialDetailsFormFieldSchema = {
    type: 'control' | 'group' | 'array';
    display?: 'main' | 'side'; //should it be displayed in the main space or as a side card?
    fields?: CredentialDetailsFormSchema; //for 'group'
    itemSchema?: CredentialDetailsFormSchema; // for 'array'
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
      type: 'array',
      display: 'main', //template expects it to be main
      itemSchema: {
        // id: { type: 'control' },
        action: { type: 'control' },
        domain: { type: 'control' },
        function: { type: 'control' },
        type: { type: 'control' },
      },
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
      type: 'array',
      display: 'main', //template expects it to be main
      itemSchema: {
        id: { type: 'control' },
        action: { type: 'control' },
        domain: { type: 'control' },
        function: { type: 'control' },
        type: { type: 'control' },
      },
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
      type: 'array',
      display: 'main',
      itemSchema: {
        id: { type: 'control' },
        hash: { type: 'control' },
        scope: { type: 'control' },
        standard: { type: 'control' },
      },
    },
  };