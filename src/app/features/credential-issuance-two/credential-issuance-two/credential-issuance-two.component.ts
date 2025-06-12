import { MatLabel } from '@angular/material/form-field';
import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { MatFormField, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { CREDENTIAL_TYPES_ARRAY, CredentialType } from 'src/app/core/models/entity/lear-credential';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { buildFormFromSchema } from '../../credential-issuance/form-schema-builder';
import { CredentialIssuanceFormSchema, IssuanceFormSchemaByType, LearCredentialMachineIssuanceFormSchema } from 'src/app/core/models/entity/lear-credential-issuance-schemas';
import { CredentialIssuanceTwoService } from '../service/credential-issuance-two.service';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-credential-issuance-two',
  standalone: true,
  imports: [KeyValuePipe, NgFor, ReactiveFormsModule, DynamicFieldComponent, MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger],
  templateUrl: './credential-issuance-two.component.html',
  styleUrl: './credential-issuance-two.component.scss'
})
export class CredentialIssuanceTwoComponent {

  readonly issuanceService = inject(CredentialIssuanceTwoService);

  public readonly credentialTypesArr = CREDENTIAL_TYPES_ARRAY;
  public selectedCredentialType$: WritableSignal<CredentialType|undefined> = signal(undefined);
  // construir formulari per a template
  public credentialFormSchema$: Signal<CredentialIssuanceFormSchema|undefined> = computed(() => this.selectedCredentialType$() ? this.getCredentialFormSchema(this.selectedCredentialType$()!) : undefined);
  //construir formulari per a model
  public form$ = computed( () => 
    this.credentialFormSchema$() 
    ? this.issuanceService.issuanceFormBuilder(this.credentialFormSchema$()!)
    : undefined);

  getCredentialFormSchema(credType: CredentialType): CredentialIssuanceFormSchema{
    return IssuanceFormSchemaByType[credType];
  }

// schemaEntries = () =>
//   this.credentialFormSchema$
//     ? Object.entries(this.credentialFormSchema$).map(([key, value]) => ({ key, value }))
//     : [];


  onSubmit() {
    const f = this.form$();
    if (f?.valid) {
      console.log('✅ Form valid', f.value);
    } else {
      f?.markAllAsTouched();
      console.log('invalid form: ');
      console.log(f?.value);
    }
  }



public onSelectionChange(selectedCredentialType: CredentialType) {
  const currentType = this.selectedCredentialType$();
  console.log('current selected type: ' + currentType);
  console.log('requested selected type: ' + selectedCredentialType);

  //todo mirar si el formulari ha estat canviat
  if (currentType !== undefined && currentType !== selectedCredentialType) {
    // todo use angular material + translate
    const shouldChange = window.confirm('Are you sure you want to change the type of credential? Your progress will be lost.');


    if (!shouldChange) {
      console.log('Did not change');
      //todo fix
      this.selectedCredentialType$.set(currentType);
      return;
    }
  }

  this.selectedCredentialType$.set(selectedCredentialType);
  console.log('changed to: ' + this.selectedCredentialType$());
}

}
