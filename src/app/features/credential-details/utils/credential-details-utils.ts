import { CredentialDetailsFormSchema, LearCredentialEmployeeDetailsFormSchema, LearCredentialMachineDetailsFormSchema, VerifiableCertificationDetailsFormSchema } from '../../../core/models/entity/lear-credential-details-schemas';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CredentialFormData, CredentialType, LEARCredential, LEARCredentialEmployee, LEARCredentialMachine, PowerActionsMap, TmfAction, TmfFunction, VerifiableCertification } from 'src/app/core/models/entity/lear-credential-employee.entity';

export const FormDataExtractorByType: Record<CredentialType, (credential: LEARCredential) => any> = {
  LEARCredentialEmployee: (credential) => {
    const c = credential as LEARCredentialEmployee;
    return {
      issuer: c.issuer,
      mandatee: c.credentialSubject.mandate.mandatee,
      mandator: c.credentialSubject.mandate.mandator,
      power: c.credentialSubject.mandate.power
    };
  },

  LEARCredentialMachine: (credential) => {
    const c = credential as LEARCredentialMachine;
    return {
      issuer: c.issuer,
      mandatee: c.credentialSubject.mandate.mandatee,
      mandator: c.credentialSubject.mandate.mandator,
      power: c.credentialSubject.mandate.power
    };
  },

  VerifiableCertification: (credential) => {
    const c = credential as VerifiableCertification;
    return {
      issuer: c.issuer,
      company: c.credentialSubject.company,
      product: c.credentialSubject.product,
      compliance: c.credentialSubject.compliance
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

    if (field.type === 'control') {
      group[key] = new FormControl(data?.[key] ?? null);
    }

    else if (field.type === 'group') {
      group[key] = buildFormFromSchema(fb, field.fields!, data?.[key]);
    }

    else if (field.type === 'array') {
      const items = (data?.[key] ?? []) as any[];
      group[key] = fb.array(
        items.map(item => buildFormFromSchema(fb, field.itemSchema!, item))
      );
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

export function getActionsByFunction(tmfFunction: TmfFunction): TmfAction[]{
      console.log('getting actions for function ' + tmfFunction);
      console.log('powersactionsmap')
      console.log(PowerActionsMap)
      console.log('returned functions')
      console.log(PowerActionsMap[tmfFunction] || [])
      return PowerActionsMap[tmfFunction] || [];
}