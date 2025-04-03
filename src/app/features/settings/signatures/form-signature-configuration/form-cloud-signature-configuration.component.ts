import { Component, inject, InjectionToken } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {SECRET_INITIAL_VALUE} from '../../models/signature.constants'
import {providersMock} from 'src/app/core/mocks/signatureConfiguration'
import { cloudProvider, signatureConfigurationResponse , FormMode} from '../../models/signature.models';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ProviderService } from '../../services/provider.service';


export const FORM_MODE = new InjectionToken<FormMode>('FORM_MODE');
export const DATA_CREDENTIAL = new InjectionToken<signatureConfigurationResponse>('DATA_CREDENTIAL');

@Component({
  selector: 'app-form-cloud-signature-configuration',
  standalone: true,
  imports: [CommonModule,TranslatePipe,
    ReactiveFormsModule,MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule],
  templateUrl: './form-cloud-signature-configuration.component.html',
  styleUrl: './form-cloud-signature-configuration.component.scss'
})
export class FormCloudSignatureConfigurationComponent {
  cloudProviders:cloudProvider[] = providersMock; 
  private fb = inject(FormBuilder);
  readonly formMode = inject(FORM_MODE);
  formDataCredential = inject(DATA_CREDENTIAL,{optional: true});
  showClientSecret:boolean = false;
  showCredentialPassword:boolean = false;
  requiresTOTP:boolean = false;
  showSecret:boolean = false;
  readonly cloudProviderCredential = this.createForm();
  private providerService = inject(ProviderService);

  
  constructor() {

    this.providerService.getAllProvider().subscribe({
      next: (providers) => {
        this.cloudProviders = providers; 
      },
      error: (err) => {
        console.error('Error loading providers', err);
      }
    });
    if (this.formMode === 'edit'&& this.formDataCredential ) {
      this.patchInitialValues(this.formDataCredential);
    }
    this.configureFormByMode();
  }

  patchInitialValues(data: signatureConfigurationResponse): void {
    this.cloudProviderCredential.patchValue({
      cloudProviderId: data.cloudProviderId,
      credentialName: data.credentialName,
      clientId: data.clientId,
      credentialId: data.credentialId,
    });
  
    //When edited, the user cannot see the secret values ​​but can edit them.    
    this.cloudProviderCredential.get('clientSecret')?.setValue(SECRET_INITIAL_VALUE);
    this.cloudProviderCredential.get('credentialPassword')?.setValue(SECRET_INITIAL_VALUE);
    this.cloudProviderCredential.get('secret')?.setValue(SECRET_INITIAL_VALUE);
  }

  onProviderChange(providerId: string): void {
      this.clearOnFocus('secret')
      const  cloudProvider = this.cloudProviders.find(provider => provider.id === providerId);
      if(cloudProvider){
        const isSameAsOriginal = this.formMode === 'edit' && providerId === this.formDataCredential?.id;
        this.requiresTOTP = !isSameAsOriginal && cloudProvider.requiresTOTP;
        const secretControl = this.cloudProviderCredential.get('secret');
        if (secretControl) {
          if (this.requiresTOTP) {
            secretControl.setValidators(Validators.required);
          } else {
            secretControl.clearValidators();
          }
          secretControl.updateValueAndValidity();
        }
      } 
  }

  private configureFormByMode(): void {
    const requiredFieldsByMode: Record<FormMode, string[]> = {
      create: [
        'cloudProviderId',
        'credentialName',
        'clientId',
        'clientSecret',
        'credentialId',
        'credentialPassword',
        'secret',
      ],
      edit: ['cloudProviderId',
            'credentialName',
            'clientId',
            'credentialId',
            'reason'],
      delete: ['reason']
    };

    const requiredFields = requiredFieldsByMode[this.formMode];

    Object.entries(this.cloudProviderCredential.controls).forEach(([key, control]) => {
      const isRequired = requiredFields.includes(key);
      control.setValidators(isRequired ? Validators.required : null);
      control.updateValueAndValidity();
    });
  }


  getFormValue() {
    return this.cloudProviderCredential.value;
  }
  
  isValid() {
    return this.cloudProviderCredential.valid;
  }
  markTouched() {
    this.cloudProviderCredential.markAllAsTouched(); 
  }

  clearOnFocus(fieldName: string): void {
    const control = this.cloudProviderCredential.get(fieldName);
    if (control?.value === SECRET_INITIAL_VALUE) { 
      control.setValue('');
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      cloudProviderId: [''],
      credentialName: [''],
      clientId: [''],
      clientSecret: [''],
      credentialId: [''],
      credentialPassword: [''],
      secret: [''],
      reason: ['']
    });
  }

}
