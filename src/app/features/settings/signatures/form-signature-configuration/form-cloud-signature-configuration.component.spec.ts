import {ComponentFixture,TestBed} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormCloudSignatureConfigurationComponent, FORM_MODE, DATA_CREDENTIAL } from './form-cloud-signature-configuration.component';
import { providersMock } from 'src/app/core/mocks/signatureConfiguration';
import { SignatureConfigurationResponse } from '../../models/signature.models';
import { SECRETS_FIELDS, SECRET_INITIAL_VALUE } from '../../models/signature.constants';
import { ProviderService } from '../../services/provider.service';
import { of, throwError } from 'rxjs';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import {signatureConfigurationCloud} from 'src/app/core/mocks/signatureConfiguration';

const providerServiceMock = {
  getAllProvider: jest.fn().mockReturnValue(of(providersMock))
};

const mockDataCredential: SignatureConfigurationResponse = signatureConfigurationCloud[0];

describe('FormCloudSignatureConfigurationComponent (standalone)', () => {
  let component: FormCloudSignatureConfigurationComponent;
  let fixture: ComponentFixture<FormCloudSignatureConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormCloudSignatureConfigurationComponent,
        ReactiveFormsModule,TranslateModule.forRoot()
      ],
      providers: [
        FormBuilder,
        { provide: FORM_MODE, useValue: 'edit' },
        { provide: DATA_CREDENTIAL, useValue: mockDataCredential },
        { provide: ProviderService, useValue: providerServiceMock }
      ]
    }) .overrideComponent(FormCloudSignatureConfigurationComponent, {
          set: { imports: [ TranslatePipe ] }
        })
        .compileComponents();
      });

     beforeEach(() => {
        fixture = TestBed.createComponent(FormCloudSignatureConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
 

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should patch initial values when in edit mode', () => {
    const formValue = component.getFormValue();
    expect(formValue.cloudProviderId).toBe(mockDataCredential.cloudProviderId);
    expect(formValue.credentialName).toBe(mockDataCredential.credentialName);
    expect(formValue.clientId).toBe(mockDataCredential.clientId);
    expect(formValue.credentialId).toBe(mockDataCredential.credentialId);
    for (const field of SECRETS_FIELDS) {
      expect(component.cloudProviderCredential.get(field)?.value).toBe(SECRET_INITIAL_VALUE);
    }
  });

  it('should clear secret field if it contains placeholder value', () => {
    component.cloudProviderCredential.get('secret')?.setValue(SECRET_INITIAL_VALUE);
    component.clearOnFocus('secret');
    expect(component.cloudProviderCredential.get('secret')?.value).toBe('');
  });

 

  it('should mark form as touched', () => {
    const spy = jest.spyOn(component.cloudProviderCredential, 'markAllAsTouched');
    component.markTouched();
    expect(spy).toHaveBeenCalled();
  });

  it('should validate the form with required fields filled', () => {
    component.cloudProviderCredential.patchValue({
      cloudProviderId: '1',
      credentialName: 'CredName',
      clientId: 'abc',
      credentialId: 'xyz',
      rationale: 'edit reason'
    });
    expect(component.isValid()).toBe(true);
  });

 
});
