import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { CredentialType } from 'src/app/core/models/entity/lear-credential';
import { CredentialIssuanceFormSchema, getLearCredentialMachineIssuanceFormSchema } from 'src/app/core/models/entity/lear-credential-issuance-schemas';
import { CountryService } from 'src/app/shared/components/form-credential/services/country.service';
import { ALL_VALIDATORS_FACTORY_MAP, ValidatorEntry } from 'src/app/shared/validators/credential-issuance/issuance-validators';


@Injectable({
  providedIn: 'root'
})
export class CredentialIssuanceTwoService {

  private readonly countryService = inject(CountryService)

  constructor() { }

  getValidatorFn(entry: ValidatorEntry): ValidatorFn | null {
    const factory = ALL_VALIDATORS_FACTORY_MAP[entry.name];
    return factory ? factory(...(entry.args ?? [])) : null;
}

  issuanceFormBuilder(schema: CredentialIssuanceFormSchema): FormGroup {
    const group: Record<string, any> = {};

    for (const [key, field] of Object.entries(schema)) {
      if (field.type === 'control') {
        const validators = field.validators?.map(this.getValidatorFn).filter(Boolean) as ValidatorFn[];
        group[key] = new FormControl('', validators);
      } else if (field.type === 'group' && field.groupFields) {
        group[key] = this.issuanceFormBuilder(field.groupFields);
      } else {
        console.warn(`Unknown or invalid field type for key "${key}"`);
      }
    }

    return new FormGroup(group);
  }

  getShemaFromCredentialType(credType: CredentialType){
    //todo
    if(credType === 'LEARCredentialEmployee'){
      return {} as any;
    }else if(credType === 'LEARCredentialMachine'){
      const countries = this.countryService.getCountriesAsSelectorOptions();
      return getLearCredentialMachineIssuanceFormSchema(countries);
      //todo
    }else if(credType === 'VerifiableCertification'){
      return {} as any;
    }
  }
}
