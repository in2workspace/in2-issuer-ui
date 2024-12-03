import { TempPower } from 'src/app/core/models/power.interface';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroupDirective, FormGroup, FormControl } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormCredentialComponent } from './form-credential.component';
import { AlertService } from 'src/app/core/services/alert.service';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { CountryService } from './services/country.service';
import { FormCredentialService } from './services/form-credential.service';
import { CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { of } from 'rxjs';
import { PopupComponent } from '../popup/popup.component';
import { Power } from 'src/app/core/models/power.interface';
import { MaxLengthDirective } from '../../directives/max-length-directive.directive';
import { CustomEmailValidatorDirective } from '../../directives/custom-email-validator.directive';
import { UnicodeValidatorDirective } from '../../directives/unicode-validator.directive';
import { OrganizationNameValidatorDirective } from '../../directives/organization-name.validator.directive';
import { Signer } from 'src/app/core/models/credentialProcedure.interface';

const mockTempPower: TempPower = {
  tmf_action: 'action1',
  tmf_domain: 'domain1',
  tmf_function: 'function1',
  tmf_type: 'type1',
  execute: true,
  create: false,
  update: false,
  delete: true,
  upload: true,
  attest: true
};
const mockPowers: Power[] = [
  { tmf_action: 'action1', tmf_domain: 'domain1', tmf_function: 'function1', tmf_type: 'type1' },
  { tmf_action: 'action2', tmf_domain: 'domain2', tmf_function: 'function2', tmf_type: 'type2' }
];
const countries: any[] = [
  {name:'Spain'},
  {name:'Finland'},
  {name:'France'},
  {name:'Portugal'}
];
const sortedCountries: any[] = [
  {name:'Finland'},
  {name:'France'},
  {name:'Portugal'},
  {name:'Spain'}
];
const mockSigner:Signer = { 
  'organizationIdentifier': 'orgId',
  'organization': 'org',
  'commonName':'common',
  'emailAddress':'email',
  'serialNumber':'serialNum',
  'country':'EU'};

describe('FormCredentialComponent', () => {
  let component: FormCredentialComponent;
  let fixture: ComponentFixture<FormCredentialComponent>;

  let mockCredentialProcedureService: jest.Mocked<CredentialProcedureService>;
  let mockAlertService: jest.Mocked<AlertService>;
  let mockCountryService: any;
  let mockAuthService: jest.Mocked<AuthService>;
  let translateService:TranslateService;
  let mockRouter: {
    navigate: jest.Mock;
  };
  let mockFormCredentialService: {
    addPower: jest.Mock<any>,
    handleSelectChange: jest.Mock<any>,
    submitCredential: jest.Mock<any>,
    reset: jest.Mock<any>,
    resetForm: jest.Mock<any>,
    convertToTempPower: jest.Mock<any>,
    checkTmfFunction: jest.Mock<any>,
    getAddedPowers: jest.Mock<any>,
    getPlainAddedPowers: jest.Mock<any>,
    getSelectedPowerName: jest.Mock<any>,
    getPlainSelectedPower: jest.Mock<any>,
    setSelectedPowerName: jest.Mock<any>,
    removePower: jest.Mock<any>,
    checkIfPowerIsAdded: jest.Mock<any>,
    powersHaveFunction: jest.Mock<any>,
    hasSelectedPower: jest.Mock<any>
  };

  beforeEach(async () => {
    mockCredentialProcedureService = {
    } as jest.Mocked<CredentialProcedureService>;

    mockAlertService = {
    } as jest.Mocked<AlertService>;

    mockFormCredentialService = {
      addPower: jest.fn(),
      handleSelectChange: jest.fn(),
      submitCredential: jest.fn().mockReturnValue(of({})),
      reset: jest.fn(),
      resetForm: jest.fn(),
      convertToTempPower: jest.fn(),
      checkTmfFunction: jest.fn(),
      getAddedPowers: jest.fn().mockReturnValue(mockPowers),
      getPlainAddedPowers: jest.fn().mockReturnValue([]),
      getSelectedPowerName: jest.fn(),
      getPlainSelectedPower: jest.fn().mockReturnValue(''),
      setSelectedPowerName: jest.fn(),
      removePower: jest.fn(),
      checkIfPowerIsAdded: jest.fn().mockReturnValue(false),
      powersHaveFunction: jest.fn(),
      hasSelectedPower: jest.fn()
    } as jest.Mocked<any>;

    mockCountryService = {
      getCountries: jest.fn().mockReturnValue(countries),
      getSortedCountries: jest.fn().mockReturnValue(sortedCountries)
    };
    mockAuthService = {
      getMandator:()=> of(null),
      getEmailName() {
        return of('User Name');
      },
      logout() {
        return of(void 0);
      },
      hasIn2OrganizationIdentifier(){
        return true
      },
      getSigner(){
        return of(mockSigner);
      }
    } as jest.Mocked<any>

    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [FormCredentialComponent, PopupComponent, MaxLengthDirective, CustomEmailValidatorDirective, UnicodeValidatorDirective, OrganizationNameValidatorDirective],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot({}),
        HttpClientModule,
      ],
      providers: [
        TranslateService,
        { provide: CredentialProcedureService, useValue: mockCredentialProcedureService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: CountryService, useValue: mockCountryService},
        { provide: FormCredentialService, useValue: mockFormCredentialService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    translateService = TestBed.inject(TranslateService);
    jest.spyOn(translateService, 'instant');
    jest.spyOn(mockCountryService, 'getSortedCountries');

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

  it('error matcher should return true if there is a mobile_phone and selectedCountryCode is missing or empty, and the mobile_phone control is dirty', () => {
    const formGroup = new FormGroup({
      mobile_phone: new FormControl('', { updateOn: 'change' })
    });

    const formDirective = {
      form: formGroup
    } as FormGroupDirective;

    component.credential = { mobile_phone: '123456789' } as any;
    component.selectedCountryCode = '';

    formGroup.controls['mobile_phone'].markAsDirty();

    const isErrorState = component.countryErrorMatcher.isErrorState(
      formGroup.controls['mobile_phone'],
      formDirective
    );

    expect(isErrorState).toBe(true);
  });

  it('error matcher should return false if selectedCountryCode is present', () => {
    const formGroup = new FormGroup({
      mobile_phone: new FormControl('', { updateOn: 'change' })
    });

    const formDirective = {
      form: formGroup
    } as FormGroupDirective;

    component.credential = { mobile_phone: '123456789' } as any;
    component.selectedCountryCode = '+34';

    const isErrorState = component.countryErrorMatcher.isErrorState(
      formGroup.controls['mobile_phone'],
      formDirective
    );

    expect(isErrorState).toBe(false);
  });

  it('error matcher should return false if mobile_phone control is not dirty', () => {
    const formGroup = new FormGroup({
      mobile_phone: new FormControl('', { updateOn: 'change' })
    });

    const formDirective = {
      form: formGroup
    } as FormGroupDirective;

    component.credential = { mobile_phone: '123456789' } as any;
    component.selectedCountryCode = '';

    const isErrorState = component.countryErrorMatcher.isErrorState(
      formGroup.controls['mobile_phone'],
      formDirective
    );

    expect(isErrorState).toBe(false);
  });

  it('should get countries from service and sort them alphabetically', ()=>{
    component.ngOnInit();
    expect(mockCountryService.getSortedCountries).toHaveBeenCalled();
    expect(component.countries).toEqual(sortedCountries);
  });

  it('should get added powers from service', ()=>{
    const observable = of('power');
    expect(component.addedPowers$).toEqual(mockPowers);
  });

  it('should check if has IN2 organization id', ()=>{
    expect(component.hasIn2OrganizationId).toBe(true);
  });

   it('should mark prefix and phone number as touched and dirty, respectively', ()=>{
    const prefixControl = {control:{markAsTouched:jest.fn()}} as any;
    const phoneControl = {control:{markAsDirty:jest.fn()}} as any;
    const prefixSpy = jest.spyOn(prefixControl.control, 'markAsTouched');
    const phoneSpy = jest.spyOn(phoneControl.control, 'markAsDirty');

    component.markPrefixAndPhoneAsTouched(prefixControl, phoneControl);

    expect(prefixSpy).toHaveBeenCalled();
    expect(phoneSpy).toHaveBeenCalled();
  });

  it('should set mandator and signer correctly if mandator is returned', fakeAsync(() => {
    const mockMandator = {
      organizationIdentifier: 'org123',
      organization: 'Org Name',
      commonName: 'Common Name',
      emailAddress: 'email@example.com',
      serialNumber: '12345',
      country: 'Country',
    };
    
    jest.spyOn(mockAuthService, 'hasIn2OrganizationIdentifier').mockReturnValue(false);
    jest.spyOn(mockAuthService, 'getMandator').mockReturnValue(of(mockMandator));
    component.viewMode='create';
    component.asSigner=false;

    component.ngOnInit();
    fixture.detectChanges();
    tick();
    
    expect(component.mandator).toEqual({
      organizationIdentifier: mockMandator.organizationIdentifier,
      organization: mockMandator.organization,
      commonName: mockMandator.commonName,
      emailAddress: mockMandator.emailAddress,
      serialNumber: mockMandator.serialNumber,
      country: mockMandator.country,
    });
    expect(component.signer).toEqual(mockSigner);
    expect(component.asSigner).toBe(false);
  }));
  

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

  it('should return the name of the country if the code matches', () => {
    component.countries = [
      { code: 'ES', name: 'Spain' },
      { code: 'FR', name: 'France' },
    ];

    const result = component.getCountryName('ES');
    expect(result).toBe('Spain');
  });

   it('should return an empty string if the code does not match any country', () => {
    component.countries = [
      { code: 'ES', name: 'Spain' },
      { code: 'FR', name: 'France' },
    ];

    const result = component.getCountryName('IT');
    expect(result).toBe('');
  });

  it('should return an empty string if the countries list is empty', () => {
    component.countries = [];

    const result = component.getCountryName('ES');
    expect(result).toBe('');
  });

  it('should check if there is selected power', ()=>{
    component.hasSelectedPower();
    expect(mockFormCredentialService.hasSelectedPower).toHaveBeenCalled();
  });

  it('should check if selected powers have function', ()=>{
    component.selectedPowersHaveFunction();
    expect(mockFormCredentialService.powersHaveFunction).toHaveBeenCalled();
  });

  it('should check if sendReminder should be shown according to VC status', ()=>{
    component.viewMode = 'create';
    component.credentialStatus = 'WITHDRAWN';
    let showBtn = component.showReminderButton();
    expect(showBtn).toBe(false);

    component.viewMode = 'detail';
    showBtn = component.showReminderButton();
    expect(showBtn).toBe(true);

    component.credentialStatus = 'PEND_DOWNLOAD';
    showBtn = component.showReminderButton();
    expect(showBtn).toBe(true);

    component.credentialStatus = 'VALID';
    showBtn = component.showReminderButton();
    expect(showBtn).toBe(false);

  });

  it('should emit sendReminder event when triggerSendReminder is called', () => {
    const spy = jest.spyOn(component.sendReminder, 'emit');
    component.triggerSendReminder();
    expect(spy).toHaveBeenCalled();
  });

  it('it should submit credential when submitCredential is called with selected power', () => {
    component.selectedCountryCode = 'US';
    mockFormCredentialService.hasSelectedPower.mockReturnValue(true);
    mockFormCredentialService.powersHaveFunction.mockReturnValue(true);
    mockFormCredentialService.getPlainAddedPowers.mockReturnValue(mockPowers);
  
    component.submitCredential();
  
    expect(mockFormCredentialService.submitCredential).toHaveBeenCalled();
    expect(mockFormCredentialService.submitCredential).toHaveBeenCalledWith(
      component.credential,
      component.selectedCountryCode,
      mockPowers,
      component.mandator,
      component.addedMandatorLastName,
      component.signer,
      mockCredentialProcedureService,
      expect.any(PopupComponent),
      expect.any(Function)
    );
  });

  it('it should not submit credential when submitCredential is called with no selected powers', () => {
    component.selectedCountryCode = 'US';
    mockFormCredentialService.hasSelectedPower.mockReturnValue(false);
    mockFormCredentialService.powersHaveFunction.mockReturnValue(true);
  
    component.submitCredential();

    expect(mockFormCredentialService.submitCredential).not.toHaveBeenCalled();
    expect(translateService.instant).toHaveBeenCalledWith("error.one_power_min");
    const message = translateService.instant("error.one_power_min");
    expect(component.popupMessage).toBe(message);
    expect(component.isPopupVisible).toBe(true);
  });

  it('it should not submit credential when submitCredential not all selected powers have selected functions', () => {
    component.selectedCountryCode = 'US';
    mockFormCredentialService.hasSelectedPower.mockReturnValue(true);
    mockFormCredentialService.powersHaveFunction.mockReturnValue(false);
  
    component.submitCredential();

    expect(mockFormCredentialService.submitCredential).not.toHaveBeenCalled();
    expect(translateService.instant).toHaveBeenCalledWith("error.one_power_min");
    const message = translateService.instant("error.one_power_min");
    expect(component.popupMessage).toBe(message);
    expect(component.isPopupVisible).toBe(true);
  });

  it('should navigate to credentials if submitting credential is successful', async () => {
    const navigateSpy = mockRouter.navigate.mockResolvedValue(true);
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    const popupSpy = jest.spyOn(component, 'openTempPopup');
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: jest.fn(),
      },
      writable: true,
    });

    component.selectedCountryCode = 'US';
    mockFormCredentialService.hasSelectedPower.mockReturnValue(true);
    mockFormCredentialService.powersHaveFunction.mockReturnValue(true);
    mockFormCredentialService.getPlainAddedPowers.mockReturnValue(mockPowers);
    
    component.submitCredential();
    await navigateSpy;
  
    expect(mockFormCredentialService.submitCredential).toHaveBeenCalledWith(
      component.credential,
      component.selectedCountryCode,
      mockPowers,
      component.mandator,
      component.addedMandatorLastName,
      component.signer,
      mockCredentialProcedureService,
      expect.any(PopupComponent),
      expect.any(Function)
    );
    expect(popupSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/organization/credentials']);
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    expect(window.location.reload).toHaveBeenCalled();
  
  });

  
  it('should close popup', fakeAsync(()=>{
    component.openTempPopup();
    expect(component.isPopupVisible).toBe(true);
    tick(1000);
    expect(component.isPopupVisible).toBe(false);

  }));

});
