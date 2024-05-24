import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormCredentialComponent } from './form-credential.component';
import { AlertService } from 'src/app/core/services/alert.service';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { CountryService } from './services/country.service';
import { FormCredentialService } from './services/form-credential.service';
import { TempPower } from '../power/power/power.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

describe('FormCredentialComponent', () => {
  let component: FormCredentialComponent;
  let fixture: ComponentFixture<FormCredentialComponent>;

  let mockCredentialProcedureService: jasmine.SpyObj<CredentialProcedureService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockCountryService: jasmine.SpyObj<CountryService>;
  let mockFormCredentialService: jasmine.SpyObj<FormCredentialService>;

  beforeEach(async () => {
    mockCredentialProcedureService = jasmine.createSpyObj('CredentialProcedureService', ['']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['']);
    mockCountryService = jasmine.createSpyObj('CountryService', ['getCountries']);
    mockFormCredentialService = jasmine.createSpyObj('FormCredentialService', ['addOption', 'handleSelectChange', 'submitCredential', 'resetForm', 'convertToTempPower']);

    await TestBed.configureTestingModule({
      declarations: [FormCredentialComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot({}),
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: CredentialProcedureService, useValue: mockCredentialProcedureService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: CountryService, useValue: mockCountryService },
        { provide: FormCredentialService, useValue: mockFormCredentialService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCredentialComponent);
    component = fixture.componentInstance;
    mockCountryService.getCountries.and.returnValue([{ name: 'USA', code: 'US' }]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.credentialForm).toBeDefined();
    expect(component.credentialForm.get('first_name')?.value).toBe('');
    expect(component.credentialForm.get('last_name')?.value).toBe('');
    expect(component.credentialForm.get('email')?.value).toBe('');
    expect(component.credentialForm.get('mobile_phone')?.value).toBe('');
    expect(component.credentialForm.get('country')?.value).toBe('');
  });

  it('should validate the form fields correctly', () => {
    const firstNameControl = component.credentialForm.get('first_name');
    firstNameControl?.setValue('123');
    expect(firstNameControl?.valid).toBeFalse();
    firstNameControl?.setValue('John');
    expect(firstNameControl?.valid).toBeTrue();

    const emailControl = component.credentialForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTrue();
  });


  it('should emit sendReminder event when triggerSendReminder is called', () => {
    spyOn(component.sendReminder, 'emit');
    component.triggerSendReminder();
    expect(component.sendReminder.emit).toHaveBeenCalled();
  });

  it('should submit credential when submitCredential is called', () => {
    component.submitCredential();
    expect(mockFormCredentialService.submitCredential).toHaveBeenCalledWith(
      component.credential,
      component.selectedCountry,
      component.addedOptions,
      component.mandator,
      mockCredentialProcedureService,
      mockAlertService,
      jasmine.any(Function)
    );
  });

  it('should reset the form when resetForm is called', () => {
    (component as any).resetForm();
    expect(mockFormCredentialService.resetForm).toHaveBeenCalled();
    expect(component.addedOptions.length).toBe(0);
    expect(component.credentialForm.pristine).toBeTrue();
  });
});
