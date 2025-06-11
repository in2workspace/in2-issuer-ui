import { MatLabel } from '@angular/material/form-field';
import { Component, signal, WritableSignal } from '@angular/core';
import { MatFormField, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { CREDENTIAL_TYPES_ARRAY, CredentialType } from 'src/app/core/models/entity/lear-credential';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { buildFormFromSchema } from '../../credential-issuance/form-schema-builder';
import { CredentialIssuanceFormSchema, LearCredentialMachineIssuanceFormSchema } from 'src/app/core/models/entity/lear-credential-issuance-schemas';

@Component({
  selector: 'app-credential-issuance-two',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, DynamicFieldComponent, MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger],
  templateUrl: './credential-issuance-two.component.html',
  styleUrl: './credential-issuance-two.component.scss'
})
export class CredentialIssuanceTwoComponent {

  public readonly credentialTypesArr = CREDENTIAL_TYPES_ARRAY;
  public selectedCredentialType$: WritableSignal<CredentialType|undefined> = signal(undefined);
  public credentialFormSchema: undefined | CredentialIssuanceFormSchema;


  private _form = signal<FormGroup | null>(null);
  form = this._form.asReadonly();

  ngOnInit() {
    this.credentialFormSchema = LearCredentialMachineIssuanceFormSchema;
    if(this.credentialFormSchema){
      this._form.set(buildFormFromSchema(this.credentialFormSchema));
    }
  }

schemaEntries = () =>
  this.credentialFormSchema
    ? Object.entries(this.credentialFormSchema).map(([key, value]) => ({ key, value }))
    : [];


  onSubmit() {
    const f = this._form();
    if (f?.valid) {
      console.log('✅ Form valid', f.value);
    } else {
      f?.markAllAsTouched();
    }
  }



public onSelectionChange(selectedCredentialType: CredentialType) {
  const currentType = this.selectedCredentialType$();

  //todo mirar si el formulari ha estat canviat
  if (currentType !== undefined && currentType !== selectedCredentialType) {
    // todo use angular material + translate
    const shouldChange = window.confirm('Are you sure you want to change the type of credential? Your progress will be lost.');

    if (!shouldChange) {
      return;
    }
  }

  this.selectedCredentialType$.set(selectedCredentialType);
}

}
