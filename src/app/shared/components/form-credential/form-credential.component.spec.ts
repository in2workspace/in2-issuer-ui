import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormCredentialComponent } from './form-credential.component';
import { AlertService } from 'src/app/core/services/alert.service';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { Country, CountryService } from './services/country.service';
import { FormCredentialService } from './services/form-credential.service';
import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { of } from 'rxjs';
import { PopupComponent } from '../popup/popup.component';

describe('FormCredentialComponent', () => {
  let component: FormCredentialComponent;
  let fixture: ComponentFixture<FormCredentialComponent>;

  let mockCredentialProcedureService: jest.Mocked<CredentialProcedureService>;
  let mockAlertService: jest.Mocked<AlertService>;
  let mockCountryService: any;
  let mockFormCredentialService: jest.Mocked<FormCredentialService>;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    mockCredentialProcedureService = {
    } as jest.Mocked<CredentialProcedureService>;

    mockAlertService = {
    } as jest.Mocked<AlertService>;

    mockFormCredentialService = {
      addOption: jest.fn(),
      handleSelectChange: jest.fn(),
      submitCredential: jest.fn(),
      resetForm: jest.fn(),
      convertToTempPower: jest.fn(),
    } as jest.Mocked<FormCredentialService>;

    mockCountryService = {
      getCountries: jest.fn()
    };
    mockAuthService = {
      getMandator() {
        return of(null);
      },
      getEmailName() {
        return of('User Name');
      },
      logout() {
        return of(void 0);
      }
    } as jest.Mocked<AuthService>


    await TestBed.configureTestingModule({
      declarations: [FormCredentialComponent, PopupComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot({}),
        RouterModule.forRoot([]),
        HttpClientModule,
      ],
      providers: [
        { provide: CredentialProcedureService, useValue: mockCredentialProcedureService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: CountryService, useValue: mockCountryService},
        { provide: FormCredentialService, useValue: mockFormCredentialService },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCredentialComponent);
    component = fixture.componentInstance;
    // inject(CountryService).getCountries();
    // inject(AuthService).getMandator();
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
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
    expect(firstNameControl?.valid).toBeFalsy();
    firstNameControl?.setValue('John');
    expect(firstNameControl?.valid).toBeTruthy();

    const emailControl = component.credentialForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should emit sendReminder event when triggerSendReminder is called', () => {
    const spy = jest.spyOn(component.sendReminder, 'emit');
    component.triggerSendReminder();
    expect(spy).toHaveBeenCalled();
  });

  it('should submit credential when submitCredential is called', () => {
    component.credentialForm.setValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '1234567890',
      country: 'US'
    });
    component.selectedCountry = 'US';
    component.addedOptions = [];

    component.submitCredential();
    expect(mockFormCredentialService.submitCredential).toHaveBeenCalled();
  });

  it('should reset the form when resetForm is called', () => {
    (component as any).resetForm();
    expect(mockFormCredentialService.resetForm).toHaveBeenCalled();
    expect(component.addedOptions.length).toBe(0);
    expect(component.credentialForm.pristine).toBeTruthy();
  });
});
