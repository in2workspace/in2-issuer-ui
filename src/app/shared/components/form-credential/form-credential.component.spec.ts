import { TempPower } from './../power/power/power.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormCredentialComponent } from './form-credential.component';
import { AlertService } from 'src/app/core/services/alert.service';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { CountryService } from './services/country.service';
import { FormCredentialService } from './services/form-credential.service';
import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { of } from 'rxjs';
import { PopupComponent } from '../popup/popup.component';
import { Power } from 'src/app/core/models/power.interface';
import { CredentialMandatee } from 'src/app/core/models/credendentialMandatee.interface';

const mockTempPower: TempPower = {
  tmf_action: 'action1',
  tmf_domain: 'domain1',
  tmf_function: 'function1',
  tmf_type: 'type1',
  execute: true,
  create: false,
  update: false,
  delete: true,
  upload: true
};
const mockPowers: Power[] = [
  { tmf_action: 'action1', tmf_domain: 'domain1', tmf_function: 'function1', tmf_type: 'type1' },
  { tmf_action: 'action2', tmf_domain: 'domain2', tmf_function: 'function2', tmf_type: 'type2' }
];

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
      checkTmfFunction: jest.fn()
    } as jest.Mocked<FormCredentialService>;

    mockCountryService = {
      getCountries: jest.fn()
    };
    mockAuthService = {
      getMandator:()=> of(null),
      getEmailName() {
        return of('User Name');
      },
      logout() {
        return of(void 0);
      }
    } as jest.Mocked<any>


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
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
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

  it('should set mandator and signer correctly if mandator is returned', (done) => {
    const mockMandator = {
      organizationIdentifier: 'org123',
      organization: 'Org Name',
      commonName: 'Common Name',
      emailAddress: 'email@example.com',
      serialNumber: '12345',
      country: 'Country',
    };
  
    jest.spyOn(mockAuthService, 'getMandator').mockReturnValue(of(mockMandator));
  
    component.ngOnInit(); 
    fixture.detectChanges();
  
    mockAuthService.getMandator().subscribe(mandator2 => {
      expect(mandator2).toBeTruthy();
      expect(component.mandator).toEqual({
        organizationIdentifier: mockMandator.organizationIdentifier,
        organization: mockMandator.organization,
        commonName: mockMandator.commonName,
        emailAddress: mockMandator.emailAddress,
        serialNumber: mockMandator.serialNumber,
        country: mockMandator.country,
      });
      expect(component.signer).toEqual({
        organizationIdentifier: mockMandator.organizationIdentifier,
        organization: mockMandator.organization,
        commonName: mockMandator.commonName,
        emailAddress: mockMandator.emailAddress,
        serialNumber: mockMandator.serialNumber,
        country: mockMandator.country,
      });
      done();
    });
  });

  it('should not initialize mandator nor signer if mandator is null', ()=>{
    component.ngOnInit();
    expect(component.mandator.commonName).toBe('');
    expect(component.mandator.country).toBe('');
    expect(component.mandator.emailAddress).toBe('');
    expect(component.mandator.organization).toBe('');
    expect(component.mandator.organizationIdentifier).toBe('');
    expect(component.mandator.serialNumber).toBe('');

    expect(component.signer).toEqual({});
  });

  it('should map power to tempPowers if viewMode is "detail"', () => {
    component.viewMode = 'detail';
    component.power = mockPowers;

    mockFormCredentialService.convertToTempPower.mockReturnValue(mockTempPower);

    component.ngOnInit();

    expect(component.tempPowers).toEqual([mockTempPower, mockTempPower]);
    expect(mockFormCredentialService.convertToTempPower).toHaveBeenCalledTimes(2);
  });

  it('should not map power to tempPowers if viewMode is not "detail"', () => {
    component.viewMode = 'create';
    component.power = mockPowers;

    component.ngOnInit();

    expect(component.tempPowers).toEqual([]);;
    expect(mockFormCredentialService.convertToTempPower).not.toHaveBeenCalled();
  });

  it('should emit sendReminder event when triggerSendReminder is called', () => {
    const spy = jest.spyOn(component.sendReminder, 'emit');
    component.triggerSendReminder();
    expect(spy).toHaveBeenCalled();
  });

  it('it should submit credential when submitCredential is called with selected power', () => {
    component.role = "user";

    component.credentialForm.setValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '1234567890',
      country: 'US'
    });
    component.selectedCountry = 'US';
    component.addedOptions = [{
      tmf_function: 'Certification',
      tmf_action: 'SomeAction',
      tmf_domain: 'SomeDomain',
      tmf_type: 'SomeType',
      upload: true,
      execute: false, 
      create: false,
      update: false,
      delete: false
    }];

    component.submitCredential();
    expect(mockFormCredentialService.submitCredential).toHaveBeenCalled();
    expect(mockFormCredentialService.submitCredential).toHaveBeenCalledWith(
      component.credential,
      component.selectedCountry,
      component.addedOptions,
      component.mandator,
      component.signer,
      mockCredentialProcedureService,
      expect.any(PopupComponent),
      expect.any(Function)
    );
  });

  it('it should not submit credential when submitCredential is called with empty addedOptions', () => {
    component.role = "user";
  
    component.credentialForm.setValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '1234567890',
      country: 'US'
    });
    component.selectedCountry = 'US';
    component.addedOptions = [{
      tmf_action: [],
      tmf_domain: 'DOME',
      tmf_function: 'ProductOffering',
      tmf_type: 'SomeType',
      execute: false,
      create: false,
      update: false,
      delete: false,
      upload: false
    }];
  
    component.submitCredential();

    expect(mockFormCredentialService.submitCredential).not.toHaveBeenCalled();
  
    expect(component.popupMessage).toBe("Each power must have at least one action selected.");
    expect(component.isPopupVisible).toBe(true);
  });

  it('should reset the form when resetForm is called', () => {
    (component as any).resetForm();
    expect(mockFormCredentialService.resetForm).toHaveBeenCalled();
    expect(component.addedOptions.length).toBe(0);
    expect(component.credentialForm.pristine).toBeTruthy();
  });

  it('should reset the form, addedOptions, and update mandator and signer if getMandator returns data', () => {
    const mockMandator = {
      organizationIdentifier: 'org123',
      organization: 'Org Name',
      commonName: 'Common Name',
      emailAddress: 'email@example.com',
      serialNumber: '12345',
      country: 'Country',
    };
  
    const mockCredential: CredentialMandatee = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '123456789'
    };
  
    mockFormCredentialService.resetForm.mockReturnValue(mockCredential);
  
    jest.spyOn(mockAuthService, 'getMandator').mockReturnValue(of(mockMandator));
  
    const resetSpy = jest.spyOn(component.credentialForm, 'reset');
  
    (component as any).resetForm();
  
    expect(mockFormCredentialService.resetForm).toHaveBeenCalled();
  
    expect(component.credential).toEqual(mockCredential);
  
    expect(component.addedOptions).toEqual([]);
  
    expect(resetSpy).toHaveBeenCalled();
  
    expect(mockAuthService.getMandator).toHaveBeenCalled();
  
    expect(component.mandator).toEqual(mockMandator);
    expect(component.signer).toEqual({
      organizationIdentifier: mockMandator.organizationIdentifier,
      organization: mockMandator.organization,
      commonName: mockMandator.commonName,
      emailAddress: mockMandator.emailAddress,
      serialNumber: mockMandator.serialNumber,
      country: mockMandator.country,
    });
  });
  

  it('should invoke addOption', ()=>{
    component.addOption([mockTempPower]);
    expect(mockFormCredentialService.addOption).toHaveBeenCalledWith(
      [],
      [mockTempPower], 
      component.isDisabled
    );
  });

  it('should call handleSelectChange and update selectedOption', () => {
    const mockEvent = new Event('change');
    
    const mockSelectedOption = 'selectedOptionValue';
    mockFormCredentialService.handleSelectChange.mockReturnValue(mockSelectedOption);
  
    component.handleSelectChange(mockEvent);
  
    expect(mockFormCredentialService.handleSelectChange).toHaveBeenCalledWith(mockEvent);
    expect(component.selectedOption).toBe(mockSelectedOption);
  });

  it('should return the correct mobile phone with country code in getter', () => {
    component.selectedCountry = '+34';
    component.credential = { mobile_phone: '123456789' } as CredentialMandatee;
  
    expect(component.mobilePhone).toBe('+34 123456789');
  });
  
  it('should set the correct mobile phone without the country code in setter', () => {
    component.selectedCountry = '+34';
    component.credential = { mobile_phone: '' } as CredentialMandatee;
  
    component.mobilePhone = '+34 987654321';
  
    expect(component.credential.mobile_phone).toBe('987654321');
  });
  
  
});
