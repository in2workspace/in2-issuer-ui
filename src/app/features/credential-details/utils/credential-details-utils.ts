import { CredentialDetailsFormSchema, LearCredentialEmployeeDetailsFormSchema, LearCredentialMachineDetailsFormSchema, VerifiableCertificationDetailsFormSchema } from '../../../core/models/entity/lear-credential-details-schemas';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CredentialFormData, CredentialType, Power, LEARCredential, LEARCredentialEmployee, LEARCredentialMachine, VerifiableCertification } from 'src/app/core/models/entity/lear-credential-employee.entity';

type ComplianceEntry = {
  id: string;
  hash: string;
  scope: string;
};

type ComplianceMap = Record<string, ComplianceEntry>;

export const FormDataExtractorByType: Record<CredentialType, (credential: LEARCredential) => any> = {
  LEARCredentialEmployee: (credential) => {
    const c = credential as LEARCredentialEmployee;
    return {
      issuer: c.issuer,
      mandatee: c.credentialSubject.mandate.mandatee,
      mandator: c.credentialSubject.mandate.mandator,
      power: mapPowerArrayByFunction(c.credentialSubject.mandate.power)
    };
  },

  LEARCredentialMachine: (credential) => {
    const c = credential as LEARCredentialMachine;
    return {
      issuer: c.issuer,
      mandatee: c.credentialSubject.mandate.mandatee,
      mandator: c.credentialSubject.mandate.mandator,
      power: mapPowerArrayByFunction(c.credentialSubject.mandate.power)
    };
  },

  VerifiableCertification: (credential) => {
    const c = credential as VerifiableCertification;
  
    const complianceEntries: ComplianceMap = c.credentialSubject.compliance.reduce(
      (acc, item) => {
        const { standard, ...rest } = item;
        acc[standard] = rest;
        return acc;
      },
      {} as ComplianceMap
    );
  
    return {
      issuer: c.issuer,
      attester: c.attester,
      company: c.credentialSubject.company,
      product: c.credentialSubject.product,
      compliance: complianceEntries,
    };
  }
};

export const FormSchemaByType: Record<CredentialType, CredentialDetailsFormSchema> = {
    LEARCredentialEmployee: LearCredentialEmployeeDetailsFormSchema,
    LEARCredentialMachine: LearCredentialMachineDetailsFormSchema,
    VerifiableCertification: VerifiableCertificationDetailsFormSchema
  };
  
  export function getFormSchemaByType(type: CredentialType): CredentialDetailsFormSchema {
    const schema = FormSchemaByType[type];
    if (!schema) {
      throw new Error(`Unsupported credential type: ${type}`);
    }
    return schema;
  }

export function buildFormFromSchema(
  fb: FormBuilder,
  schema: CredentialDetailsFormSchema,
  data: any
): FormGroup {
  const group: Record<string, any> = {};

  for (const key in schema) {
    //don't show Issuer if empty
    if (
      key === 'issuer' &&
      schema[key].type === 'group' &&
      (!data?.issuer?.id || data.issuer.id === '')
    ) {
      continue;
    }

    const field = schema[key];

    if (key === 'compliance' && field.type === 'group') {
      const complianceGroup: Record<string, FormGroup> = {};
      const complianceData = data?.[key] ?? {};
    
      for (const standard in complianceData) {
        complianceGroup[standard] = fb.group({
          id: new FormControl(complianceData[standard].id),
          hash: new FormControl(complianceData[standard].hash),
          scope: new FormControl(complianceData[standard].scope),
        });
      }
    
      group[key] = fb.group(complianceGroup);
    }

    else if (key === 'power' && field.type === 'group') {
      const powerData = data?.[key] ?? {};
      const powerGroup: Record<string, FormGroup> = {};
    
      for (const func in powerData) {
        const actions = powerData[func];
        const actionGroup: Record<string, FormControl> = {};
    
        for (const action in actions) {
          actionGroup[action] = new FormControl(true); // toggle activat
        }
    
        powerGroup[func] = fb.group(actionGroup);
      }
    
      group[key] = fb.group(powerGroup);
    }

    else if (field.type === 'control') {
      group[key] = new FormControl(data?.[key] ?? null);
    }

    else if (field.type === 'group') {
      group[key] = buildFormFromSchema(fb, field.fields!, data?.[key]);
    }

  }

  return fb.group(group);
}  
  
export function getFormDataByType<T extends CredentialType>(
  credential: LEARCredential,
  type: T
): CredentialFormData {
  console.log('data extractor; credential:' +  credential)
  console.log('data extractor; type:' +  type)
  const extractor = FormDataExtractorByType[type];
  if (!extractor) {
    throw new Error(`Unsupported data extractor for type: ${type}`);
  }
  return extractor(credential) as CredentialFormData;
}

export function mapPowerArrayByFunction(power: Power[]): Record<string, Record<string, true>> {
  const grouped: Record<string, Record<string, true>> = {};

  for (const entry of power) {
    const actions = Array.isArray(entry.action) ? entry.action : [entry.action];
    const func = entry.function;

    if (!grouped[func]) grouped[func] = {};
    for (const action of actions) {
      grouped[func][action] = true;
    }
  }

  return grouped;
}
