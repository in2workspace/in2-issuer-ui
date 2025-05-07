import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormSchema, LearCredentialEmployeeFormSchema, LearCredentialMachineFormSchema, VerifiableCertificationFormSchema } from '../models/detail-form-models';
import { CredentialType, FormDataByType, LEARCredential, LEARCredentialEmployee, LEARCredentialMachine, VerifiableCertification } from 'src/app/core/models/entity/lear-credential-employee.entity';

export const FormSchemaByType: Record<CredentialType, FormSchema> = {
    LEARCredentialEmployee: LearCredentialEmployeeFormSchema,
    LEARCredentialMachine: LearCredentialMachineFormSchema,
    VerifiableCertification: VerifiableCertificationFormSchema
  };
  
  export function getFormSchemaByType(type: CredentialType): FormSchema {
    const schema = FormSchemaByType[type];
    if (!schema) {
      throw new Error(`Unsupported credential type: ${type}`);
    }
    return schema;
  }

export function buildFormFromSchema(
  fb: FormBuilder,
  schema: FormSchema,
  data: any
): FormGroup {
  const group: Record<string, any> = {};

  for (const key in schema) {
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

const FormDataExtractorByType: Record<CredentialType, (credential: LEARCredential) => any> = {
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
        product: c.credentialSubject.product
      };
    }
  };
  
  
  export function getFormDataByType<T extends CredentialType>(
    credential: LEARCredential & { type: [T] }
  ): FormDataByType[T] {
    const type = credential.type[0] as T;
    const extractor = FormDataExtractorByType[type];
    if (!extractor) {
      throw new Error(`Unsupported data extractor for type: ${type}`);
    }
    return extractor(credential) as FormDataByType[T];
  }
  
  
  export function typeCast<T extends CredentialType>(
    credential: LEARCredential,
    type: T
  ): LEARCredential & { type: [T] } {
    return credential as LEARCredential & { type: [T] };
  }