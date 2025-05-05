import { Component, Input, OnInit, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import {
  CredentialSpecific,
  CredentialSchemaSpecific,
  CREDENTIAL_SCHEMAS,
  IssuerValidator,
  PowerInstance
} from './../../../core/models/details/models-details';
import { PowersTwoComponent } from '../powers-two/powers-two.component';

// 🔵 VALIDATORS
export function organizationNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^[\p{Script=Latin}\p{M}0-9'&\-,.()/ ]+$/u;
    const value = control.value;
    if (!value) return null;
    return pattern.test(value) ? null : { invalidOrgName: true };
  };
}

export function organizationIdentifierValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^[a-zA-Z0-9]+$/;
    const value = control.value;
    if (!value) return null;
    if (value.toLowerCase().startsWith('vat')) {
      return { startsWithVAT: true };
    }
    return pattern.test(value) ? null : { invalidIdentifier: true };
  };
}

// 🔵 Validator mapper
const validatorMapper: Record<string, (param?: any) => ValidatorFn> = {
  required: () => Validators.required,
  organizationName: () => organizationNameValidator(),
  organizationIdentifier: () => organizationIdentifierValidator(),
  maxLength: (max: number) => Validators.maxLength(max),
};

// 🔵 Validació de powers
export function selectedPowersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) {
      return { invalidStructure: true };
    }
    if (control.length === 0) {
      return { noPowersSelected: true };
    }
    const hasInvalidPower = control.controls.some(group => {
      const functionsGroup = group as FormGroup;
      return !Object.values(functionsGroup.value).some(value => value === true);
    });
    if (hasInvalidPower) {
      return { noFunctionSelected: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-credential-details-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PowersTwoComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    TranslatePipe
  ],
  templateUrl: './credential-details-form.component.html',
  styleUrl: './credential-details-form.component.scss'
})
export class CredentialDetailsFormComponent implements OnInit{

  fb = inject(FormBuilder);
  translate = inject(TranslateService);

  countries$: Observable<string[]> = of(['france', 'italy', 'spain', 'germany', 'portugal']);

  // 🔵 INPUTS
  @Input() credential!: CredentialSpecific;

  credentialSchema!: CredentialSchemaSpecific;
  form!: FormGroup;

  get powersFormArray(): FormArray {
    return this.form.get('powers') as FormArray;
  }

  ngOnInit() {
    this.loadForm();
  }

  private loadForm() {
    if (!this.credential) {
      console.error('Credential not provided');
      return;
    }

    // 🔵 Agafem l'esquema a partir del tipus
    this.credentialSchema = CREDENTIAL_SCHEMAS[this.credential.type];

    const mandateeGroup =
    this.credential.type !== 'certification' && this.credentialSchema.type !== 'certification' && this.credentialSchema.mandatee
      ? this.buildGroup(this.credentialSchema.mandatee, this.credential.mandatee!)
      : null;
  
  const mandatorGroup =
    this.credential.type !== 'certification' && this.credentialSchema.type !== 'certification' && this.credentialSchema.mandator
      ? this.buildGroup(this.credentialSchema.mandator, this.credential.mandator!)
      : null;
  

    const signerGroup = this.buildGroup(this.credentialSchema.signer, this.credential.signer);

    this.form = this.fb.group({
      mandatee: mandateeGroup || this.fb.group({}),
      mandator: mandatorGroup || this.fb.group({}),
      signer: signerGroup,
      powers: this.buildPowersArray(this.credential.powers)
    });

    this.form.disable(); // 🔵 Desactivem per defecte
  }

  private buildGroup(
    section: Record<string, { type: string; validators: IssuerValidator[] }>,
    initialValues?: Record<string, any>
  ): FormGroup {
    const group: Record<string, FormControl> = {};

    for (const [fieldName, fieldSchema] of Object.entries(section)) {
      let initialValue: any = '';

      if (initialValues && initialValues[fieldName] !== undefined) {
        initialValue = initialValues[fieldName];
      } else {
        initialValue = fieldSchema.type === 'number' ? null : '';
      }

      group[fieldName] = this.fb.control(initialValue, this.mapValidators(fieldSchema.validators));
    }

    return this.fb.group(group);
  }

  private buildPowersArray(powers: PowerInstance[]): FormArray {
    const formArray = this.fb.array<FormGroup>([], { validators: selectedPowersValidator() });
  
    powers.forEach(power => {
      const schemaPower = this.credentialSchema.powers.find(p => p.name === power.name);
      if (!schemaPower) {
        console.warn(`Power ${power.name} not found in schema`);
        return;
      }
  
      const functionsGroup = this.fb.group({});
  
      schemaPower.functions.forEach(schemaFunc => {
        const found = power.functions.find(fnc => fnc.name === schemaFunc.name);
        functionsGroup.addControl(
          schemaFunc.name,
          new FormControl(found ? found.value : false) // 🔵 Si no trobat, false
        );
      });
  
      formArray.push(functionsGroup);
    });
  
    return formArray;
  }
  

  private mapValidators(validators: IssuerValidator[]): ValidatorFn[] {
    if (!validators || validators.length === 0) {
      return [];
    }

    return validators.map((validator) => {
      const validatorFnFactory = validatorMapper[validator.name];
      if (!validatorFnFactory) {
        console.warn(`Validator ${validator.name} not found.`);
        return () => null;
      }
      return 'param' in validator ? validatorFnFactory(validator.param) : validatorFnFactory();
    });
  }

  getError(section: string, field: string): { key: string; params?: any } | null {
    const control = this.form.get(`${section}.${field}`);
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    if (control.hasError('required')) {
      return { key: 'error.form.required' };
    }

    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength')?.requiredLength;
      return { key: 'error.form.maxlength_dynamic', params: { max: requiredLength } };
    }

    if (control.hasError('invalidOrgName')) {
      return { key: 'error.form.invalid_character' };
    }

    if (control.hasError('startsWithVAT')) {
      return { key: 'error.form.starts_with_vat' };
    }

    if (control.hasError('invalidIdentifier')) {
      return { key: 'error.form.only_letters_and_numbers' };
    }

    return { key: 'error.unknown_error' };
  }

  isNationalityField(fieldValue: any): boolean {
    return fieldValue?.type === 'nationality';
  }

  isNumberField(fieldKey: any): boolean {
    return fieldKey?.value?.type === 'number';
  }

  getFieldKeyAsString(fieldKey: any): string {
    return typeof fieldKey?.key === 'string' ? fieldKey.key : '';
  }

  getSection(section: string): Record<string, { type: string; validators: IssuerValidator[] }> | null {
    if (
      this.credentialSchema.type !== 'certification' &&
      (section === 'mandatee' || section === 'mandator' || section === 'signer')
    ) {
      return (this.credentialSchema as any)[section];
    }
  
    if (this.credentialSchema.type === 'certification' && section === 'signer') {
      return (this.credentialSchema as any)['signer'];
    }
  
    return null;
  }
  
}
