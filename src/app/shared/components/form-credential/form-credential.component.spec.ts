import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, FormGroupDirective, FormGroup, FormControl } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormCredentialComponent } from './form-credential.component';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { CountryService } from './services/country.service';
import { FormCredentialService } from './services/form-credential.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observer, of } from 'rxjs';
import { MaxLengthDirective } from '../../directives/validators/max-length-directive.directive';
import { CustomEmailValidatorDirective } from '../../directives/validators/custom-email-validator.directive';
import { UnicodeValidatorDirective } from '../../directives/validators/unicode-validator.directive';
import { OrganizationNameValidatorDirective } from '../../directives/validators/organization-name.validator.directive';
import { TempPower } from 'src/app/core/models/temporal/temp-power.interface';
import { Power, Signer } from 'src/app/core/models/entity/lear-credential-employee.entity';
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { DialogWrapperService } from '../dialog/dialog-wrapper/dialog-wrapper.service';
import { DialogData } from '../dialog/dialog.component';
import { RouterTestingModule } from '@angular/router/testing';

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
  'country':'EU'
};

describe('FormCredentialComponent', () => {
  let component: FormCredentialComponent;
  let fixture: ComponentFixture<FormCredentialComponent>;

  let mockCredentialProcedureService: jest.Mocked<CredentialProcedureService>;
  let dialogService: {
    openDialog: jest.Mock;
    openDialogWithCallback: jest.Mock;
  };
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
    hasSelectedPower: jest.Mock<any>,
    getCountryNameFromIsoCode: jest.Mock<any>
    getCountryPhoneFromIsoCountryCode: jest.Mock<any>,
    getCountryFromName: jest.Mock<any>
  };

  beforeEach(async () => {
    let mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null)
        }
      }
    };
    mockCredentialProcedureService = {
    } as jest.Mocked<CredentialProcedureService>;

    dialogService = {
      openDialog: jest.fn(),
      openDialogWithCallback: jest.fn()
    };

    mockFormCredentialService = {
      addPower: jest.fn(),
      handleSelectChange: jest.fn(),
      submitCredential: jest.fn().mockReturnValue(of({})),
      reset: jest.fn(),
      resetForm: jest.fn(),
      convertToTempPower: jest.fn(),
      checkTmfFunction: jest.fn(),
      getAddedPowers: jest.fn().mockReturnValue(of(mockPowers)),
      getPlainAddedPowers: jest.fn().mockReturnValue([]),
      getSelectedPowerName: jest.fn().mockReturnValue(of("mock_name")),
      getPlainSelectedPower: jest.fn().mockReturnValue(''),
      setSelectedPowerName: jest.fn(),
      removePower: jest.fn(),
      checkIfPowerIsAdded: jest.fn().mockReturnValue(false),
      powersHaveFunction: jest.fn(),
      hasSelectedPower: jest.fn(),
      getCountryNameFromIsoCode: jest.fn(),
      getCountryPhoneFromIsoCountryCode: jest.fn()
    } as jest.Mocked<any>;

    mockCountryService = {
      getCountries: jest.fn().mockReturnValue(countries),
      getSortedCountries: jest.fn().mockReturnValue(sortedCountries),
      getCountryPhoneFromIsoCountryCode: jest.fn(),
      getCountryNameFromIsoCountryCode: jest.fn(),
      getCountryFromIsoCode: jest.fn(),
      getCountryFromName: jest.fn()
    };
    mockAuthService = {
      getMandator:()=> of(null),
      getEmailName() {
        return of('User Name');
      },
      getName() {
        return of('Name');
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
    schemas: [NO_ERRORS_SCHEMA],
    imports: [FormsModule,
        TranslateModule.forRoot({}),
        RouterModule.forRoot([]),
        FormCredentialComponent,
        MaxLengthDirective, CustomEmailValidatorDirective, UnicodeValidatorDirective, OrganizationNameValidatorDirective,
        BrowserAnimationsModule],
    providers: [
        TranslateService,
        { provide: CredentialProcedureService, useValue: mockCredentialProcedureService },
        { provide: DialogWrapperService, useValue: dialogService },
        { provide: CountryService, useValue: mockCountryService },
        { provide: FormCredentialService, useValue: mockFormCredentialService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: {} } } },
        provideHttpClient(withInterceptorsFromDi())
    ]
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

  it('error matcher should return true if there is a mobile_phone and selectedCountryPrefix is missing or empty, and the mobile_phone control is dirty', () => {
    const formGroup = new FormGroup({
      mobile_phone: new FormControl('', { updateOn: 'change' })
    });

    const formDirective = {
      form: formGroup
    } as FormGroupDirective;

    component.credential = { mobile_phone: '123456789' } as any;
    component.selectedMandateeCountryIsoCode = '';

    formGroup.controls['mobile_phone'].markAsDirty();

    const isErrorState = component.countryErrorMatcher.isErrorState(
      formGroup.controls['mobile_phone'],
      formDirective
    );

    expect(isErrorState).toBe(true);
  });

  it('error matcher should return false if selectedCountryIsoCode is present', () => {
    const formGroup = new FormGroup({
      mobile_phone: new FormControl('', { updateOn: 'change' })
    });

    const formDirective = {
      form: formGroup
    } as FormGroupDirective;

    component.credential = { mobile_phone: '123456789' } as any;
    component.selectedMandateeCountryIsoCode = '+34';

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
    component.selectedMandateeCountryIsoCode = '';

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
    component.addedPowers$.subscribe((powers) => {
      expect(powers).toEqual(mockPowers);
    });
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


  it('should not add mandator nor signer if mandator is null', ()=>{
    component.ngOnInit();
    expect(component.mandator.commonName).toBe('');
    expect(component.mandator.country).toBe('');
    expect(component.mandator.emailAddress).toBe('');
    expect(component.mandator.organization).toBe('');
    expect(component.mandator.organizationIdentifier).toBe('');
    expect(component.mandator.serialNumber).toBe('');

    expect(component.signer).toEqual({
      organizationIdentifier: '',
      organization: '',
      commonName: '',
      emailAddress: '',
      serialNumber: '',
      country: ''
    });
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

    expect(component.tempPowers).toEqual([]);
    expect(mockFormCredentialService.convertToTempPower).not.toHaveBeenCalled();
  });

  it('should get country name from iso code', ()=>{
    component.getCountryNameFromIsoCode('any');
    expect(mockCountryService.getCountryNameFromIsoCountryCode).toHaveBeenCalledWith('any');
  });

  it('should get country phone prefix from iso code', ()=>{
    component.getCountryPhoneFromIsoCountryCode('any');
    expect(mockCountryService.getCountryPhoneFromIsoCountryCode).toHaveBeenCalledWith('any');
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

    component.credentialStatus = 'DRAFT';
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

  it('should open submit dialog and call submitCredential', () => {
    const dialogData: DialogData = {
      title: translateService.instant("credentialIssuance.create-confirm-dialog.title"),
      message: translateService.instant("credentialIssuance.create-confirm-dialog.message"),
      confirmationType: 'async',
      status: 'default',
      loadingData: {
        title: translateService.instant("credentialIssuance.creating-credential"),
        message: ''
      }
    };
  
    jest.spyOn(component, 'submitCredential').mockReturnValue(of('Submitted'));
  
    component.openSubmitDialog();
  
    expect(dialogService.openDialogWithCallback).toHaveBeenCalledWith(
      expect.objectContaining(dialogData),
      expect.any(Function)
    );
  
    const [, callbackFn] = dialogService.openDialogWithCallback.mock.calls[0];
  
    callbackFn().subscribe(() => {
      expect(component.submitCredential).toHaveBeenCalled();
    });
  });
  

  it('it should submit credential when submitCredential is called with selected power', () => {
    component.selectedMandateeCountryIsoCode = 'US';
    component.asSigner = false;
    mockCountryService.getCountryFromIsoCode.mockReturnValue('States');
    mockFormCredentialService.hasSelectedPower.mockReturnValue(true);
    mockFormCredentialService.powersHaveFunction.mockReturnValue(true);
    mockFormCredentialService.getPlainAddedPowers.mockReturnValue(mockPowers);

    component.submitCredential();

    expect(mockFormCredentialService.submitCredential).toHaveBeenCalled();
    expect(mockFormCredentialService.submitCredential).toHaveBeenCalledWith(
      component.credential,
      'States',
      undefined,
      mockPowers,
      component.mandator,
      component.addedMandatorLastName,
      component.signer,
      mockCredentialProcedureService,
      expect.any(Function)
    );
  });

  it('it should submit credential with selected mandator country if is Signer', () => {
    mockCountryService.getCountryFromIsoCode.mockReturnValue('States');
    component.asSigner = true;
    mockCountryService.getCountryFromName.mockReturnValue('mandatorCountry');
    mockFormCredentialService.hasSelectedPower.mockReturnValue(true);
    mockFormCredentialService.powersHaveFunction.mockReturnValue(true);
    mockFormCredentialService.getPlainAddedPowers.mockReturnValue(mockPowers);

    component.submitCredential();

    expect(mockFormCredentialService.submitCredential).toHaveBeenCalled();
    expect(mockFormCredentialService.submitCredential).toHaveBeenCalledWith(
      component.credential,
      'States',
      'mandatorCountry',
      mockPowers,
      component.mandator,
      component.addedMandatorLastName,
      component.signer,
      mockCredentialProcedureService,
      expect.any(Function)
    );
  });

  it('it should not submit credential when submitCredential is called with no selected powers', () => {
    component.selectedMandateeCountryIsoCode = 'US';
    mockFormCredentialService.hasSelectedPower.mockReturnValue(false);
    mockFormCredentialService.powersHaveFunction.mockReturnValue(true);

    component.submitCredential();

    expect(mockFormCredentialService.submitCredential).not.toHaveBeenCalled();
  });

  it('it should not submit credential when submitCredential not all selected powers have selected functions', () => {
    component.selectedMandateeCountryIsoCode = 'US';
    mockFormCredentialService.hasSelectedPower.mockReturnValue(true);
    mockFormCredentialService.powersHaveFunction.mockReturnValue(false);

    component.submitCredential();

    expect(mockFormCredentialService.submitCredential).not.toHaveBeenCalled();
  });

  it('should navigate to credentials if submitting credential is successful and dialog data is correct', fakeAsync(() => {
    mockCountryService.getCountryFromIsoCode.mockReturnValue('States');
    mockCountryService.getCountryFromName.mockReturnValue('mandatorCountry');
    const consoleErrorSpy = jest.spyOn(console, 'error');
  
    component.asSigner = true;
    mockFormCredentialService.hasSelectedPower.mockReturnValue(true);
    mockFormCredentialService.powersHaveFunction.mockReturnValue(true);
  
    jest.spyOn(mockFormCredentialService, 'submitCredential').mockReturnValue(of('Success'));
    const dialogAfterClosedMock = jest.fn().mockReturnValue(of(true));
    jest.spyOn(dialogService, 'openDialog').mockReturnValue({ afterClosed: dialogAfterClosedMock } as any);
  
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: jest.fn(),
      },
      writable: true,
    });
  
    jest.spyOn(mockRouter, 'navigate').mockResolvedValue(true);
  
    const result = component.submitCredential();
    tick();
  
    result.subscribe(() => {
      expect(mockFormCredentialService.submitCredential).toHaveBeenCalledWith(
        component.credential,
        'States',
        'mandatorCountry',
        mockFormCredentialService.getPlainAddedPowers(),
        component.mandator,
        component.addedMandatorLastName,
        component.signer,
        (component as any).credentialProcedureService,
        expect.any(Function)
      );

      const expectedDialogData: DialogData = {
        title: 'credentialIssuance.create-success-dialog.title',
        message: 'credentialIssuance.create-success-dialog.message',
        confirmationType: 'none',
        status: 'default'
      };
      expect(dialogService.openDialog).toHaveBeenCalledWith(expectedDialogData);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/organization/credentials']);
      expect(window.location.reload).toHaveBeenCalled();
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  }));

});
