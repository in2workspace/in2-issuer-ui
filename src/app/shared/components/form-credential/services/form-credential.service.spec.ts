import { TestBed } from '@angular/core/testing';
import { FormCredentialService, isCertification, isProductOffering } from './form-credential.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthModule } from 'angular-auth-oidc-client';
import { TempPower } from "../../../../core/models/temp/temp-power.interface";
import { Country } from './country.service';
import { provideHttpClient } from '@angular/common/http';
import { EmployeeMandatee, EmployeeMandator, EmployeeSigner, StrictPower, TmfAction } from 'src/app/core/models/entity/lear-credential';

(globalThis as any).structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));

describe('FormCredentialService', () => {
  let service: FormCredentialService;
  let credentialProcedureService: any;
  let mockCredential: EmployeeMandatee;
  let mockMandateeSelectedCountry: Country;
  let mockMandator: EmployeeMandator;
  let mockSigner: EmployeeSigner;
  let mockTempPower: TempPower;
  let mockAddedOptions: TempPower[];

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
        AuthModule.forRoot({ config: {} })],
    providers: [
        FormCredentialService,
        TranslateService,
        provideHttpClient(),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(FormCredentialService);
    // popupComponent = TestBed.inject(PopupComponent);
    credentialProcedureService = {
      createProcedure: jest.fn()
    };

    // Mock the return value of createProcedure
    credentialProcedureService.createProcedure = jest.fn().mockReturnValue(of({}));

    mockCredential = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      nationality: 'ES',
    };
    mockMandateeSelectedCountry = {
      name: 'Spain',
      phoneCode: '34',
      isoCountryCode: 'ES'
    };
    mockMandator = {
      organizationIdentifier: '1',
      organization: 'MandatorOrg',
      commonName: 'Mandator',
      emailAddress: 'mandator@example.com',
      serialNumber: '123456',
      country: 'ES',
    };
    mockSigner = {
      organizationIdentifier: '1',
      organization: 'MandatorOrg',
      commonName: 'Mandator',
      emailAddress: 'mandator@example.com',
      serialNumber: '123456',
      country: 'ES',
    };
    mockTempPower = {
      action: [],
      domain: 'domain',
      function: 'ProductOffering',
      type: 'type',
      execute: false,
      create: false,
      update: false,
      delete: false,
      upload: false,
      attest: false
    };
    mockAddedOptions = [
      { ...mockTempPower },
      { ...mockTempPower }
    ];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get plain added powers', ()=>{
    const exampleAddedPowers = [{power:'one'}, {power:'two'}];
    service.addedPowersSubject = new BehaviorSubject<any>(exampleAddedPowers);
    const addedPowers = service.getPlainAddedPowers();
    expect(addedPowers).toEqual(exampleAddedPowers);
  });

  it('should get plain selected power', ()=>{
    const exampleSelectedPower = 'selPower';
    service.selectedPowerNameSubject = new BehaviorSubject<any>(exampleSelectedPower);
    const addedPowers = service.getPlainSelectedPower();
    expect(addedPowers).toEqual(exampleSelectedPower);
  });

  it('should get added powers observable', ()=>{
    const powers$ = service.getAddedPowers();
    expect(powers$).toBe((service as any).addedPowers$);
  });

  it('should get selected power observable', ()=>{
    const selectedPower$ = service.getSelectedPowerName();
    expect(selectedPower$).toBe((service as any).selectedPowerName$);
  });

  it('should set added powers', ()=>{
    const newPowers = [{power:'one'}, {power:'two'}] as any;

    const emittedValues = [] as any;
    service.addedPowersSubject.subscribe(powers=>{
      emittedValues.push(...powers)
    })

    service.setAddedPowers(newPowers);

    expect(emittedValues[0]).toEqual(newPowers[0]);
      expect(emittedValues[1]).toEqual(newPowers[1]);
  });

  it('should set selected power', ()=>{
    const newPowerName = 'newPower' as any;

    service.setSelectedPowerName(newPowerName);

    service.selectedPowerNameSubject.subscribe(power=>{
      expect(power).toBe(newPowerName);
    })
  });

  it('should add a new power', () => {
    const existingPowers: TempPower[] = [
      { ...mockTempPower, function: 'Onboarding' }
    ];
    const newPower: TempPower = { ...mockTempPower, function: 'ProductOffering' };
    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue(existingPowers);
    const setAddedPowersSpy = jest.spyOn(service, 'setAddedPowers');

    service.addPower(newPower);

    expect(setAddedPowersSpy).toHaveBeenCalledWith([...existingPowers, newPower]);
  });

  it('should remove the specified power from added powers', () => {
    const existingPowers: TempPower[] = [
      { ...mockTempPower, function: 'Onboarding' },
      { ...mockTempPower, function: 'ProductOffering' },
      { ...mockTempPower, function: 'Certification' },
    ];

    const powerToRemove = 'ProductOffering';
    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue(existingPowers);
    const setAddedPowersSpy = jest.spyOn(service, 'setAddedPowers');

    service.removePower(powerToRemove);

    const expectedPowers = existingPowers.filter(
      (power) => power.function !== powerToRemove
    );
    expect(setAddedPowersSpy).toHaveBeenCalledWith(expectedPowers);
  });

  it('should not modify added powers if the specified power is not found', () => {
    const existingPowers: TempPower[] = [
      { ...mockTempPower, function: 'Onboarding' },
      { ...mockTempPower, function: 'Certification' },
    ];

    const powerToRemove = 'Power2'; // Not in the list
    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue(existingPowers);
    const setAddedPowersSpy = jest.spyOn(service, 'setAddedPowers');

    service.removePower(powerToRemove);

    expect(setAddedPowersSpy).toHaveBeenCalledWith(existingPowers);
  });

  it('should reset added powers and selected power name', () => {
    const setAddedPowersSpy = jest.spyOn(service, 'setAddedPowers');
    const setSelectedPowerNameSpy = jest.spyOn(service, 'setSelectedPowerName');

    service.reset();

    expect(setAddedPowersSpy).toHaveBeenCalledWith([]);
    expect(setSelectedPowerNameSpy).toHaveBeenCalledWith('');
  });

  it('should reset the form correctly', () => {
    const credential: EmployeeMandatee = service.resetForm();

    expect(credential.firstName).toBe('');
    expect(credential.lastName).toBe('');
    expect(credential.email).toBe('');
    expect(credential.nationality).toBe('');
  });

    it('should handle select change correctly', () => {
    const event = { target: { value: 'newValue' } } as unknown as Event;
    const result: string = service.handleSelectChange(event);

    expect(result).toBe('newValue');
  });

it('should submit credential correctly', (done) => {
  const mockMandatorCountry = undefined;
  jest.spyOn(service, 'resetForm');
  // jest.spyOn(popupComponent, 'showPopup');
  jest.spyOn(service, 'checkFunction');
  credentialProcedureService.createProcedure.mockReturnValue(of({}));

  service.submitCredential(
    mockCredential,
    mockMandatorCountry,
    mockAddedOptions,
    mockMandator,
    'lastName',
    credentialProcedureService as any
  ).subscribe(() => {
    expect(credentialProcedureService.createProcedure).toHaveBeenCalledWith(
      expect.objectContaining({
        schema: 'LEARCredentialEmployee',
        format: 'jwt_vc_json',
        payload: expect.objectContaining({
          mandatee: expect.any(Object),
          mandator: expect.any(Object),
          power: expect.any(Array)
        }),
        operation_mode: 'S'
      })
    );
    // expect(service.resetForm).toHaveBeenCalled();
    expect(service.checkFunction).toHaveBeenCalledTimes(mockAddedOptions.length);
    done();
  });
});

it('should handle error when submitCredential fails', (done) => {
  const errorMessage = 'Submission failed';
  credentialProcedureService.createProcedure.mockReturnValue(throwError(() => new Error(errorMessage)));
  jest.spyOn(service, 'resetForm');
  // jest.spyOn(popupComponent, 'showPopup');

  service.submitCredential(
    mockCredential,
    undefined,
    mockAddedOptions,
    mockMandator,
    'lastName',
    credentialProcedureService as any
  ).subscribe({
    next: () => {
      done.fail('Should not reach next block');
    },
    error: (error) => {
      try {
        expect(service.resetForm).not.toHaveBeenCalled();
        done();
      } catch (assertionError) {
        done(assertionError);
      }
    }
  });
});

it('should map addedOptions to Power objects correctly', () => {
  const expectedPower: StrictPower = {
    action: 'Execute',
    domain: 'expectedDomain',
    function: 'Onboarding',
    type: 'expectedType'
  };

  const checkTmfSpy = jest.spyOn(service, 'checkFunction').mockReturnValue(expectedPower);
  credentialProcedureService.createProcedure.mockReturnValue(of({}));

  service.submitCredential(
    mockCredential,
    undefined,
    mockAddedOptions,
    mockMandator,
    'lastName',
    credentialProcedureService
  );

  expect(credentialProcedureService.createProcedure).toHaveBeenCalled();
  expect(checkTmfSpy).toHaveBeenCalled();

  expect(credentialProcedureService.createProcedure).toHaveBeenCalledWith(
    expect.objectContaining({
      payload: expect.objectContaining({
        power: [expectedPower, expectedPower]
      })
    })
  );
});


  it('should add "Upload" to action if option.upload is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      domain: 'domain',
      function: 'Certification',
      type: 'type',
      upload: true
    };

    const result = isCertification(option, []);
    expect(result).toContain('Upload');
  });

  it('should return an empty array if no conditions are true', () => {
    const option: TempPower = {
      ...mockTempPower,
      domain: 'domain',
      function: 'ProductOffering',
      type: 'type',
    };

    const result = isCertification(option, []);
    expect(result).toEqual([]);
  });

  it('should add "Create" to action if option.create is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      domain: 'domain',
      function: 'ProductOffering',
      type: 'type',
      create: true
    };

    const result = isProductOffering(option, []);
    expect(result).toContain('Create');
  });

  it('should add "Update" to action if option.update is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      domain: 'domain',
      function: 'ProductOffering',
      type: 'type',
      update: true
    };

    const result = isProductOffering(option, []);
    expect(result).toContain('Update');
  });

  it('should add "Delete" to action if option.delete is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      domain: 'domain',
      function: 'ProductOffering',
      type: 'type',
      delete: true
    };

    const result = isProductOffering(option, []);
    expect(result).toContain('Delete');
  });

  it('should return an empty array if no conditions are true', () => {
    const option: TempPower = {
      ...mockTempPower,
      domain: 'domain',
      function: 'ProductOffering',
      type: 'type',
    };

    const result = isProductOffering(option, []);
    expect(result).toEqual([]);
  });

it('should add the correct actions based on TempPower properties', () => {
  const tempPower: TempPower = {
    ...mockTempPower,
    upload: true,
    attest: false
  };
  const action: TmfAction[] = ['Delete'];

  const result = isCertification(tempPower, action);

  expect(result).toEqual(['Delete', 'Upload']);
});


it('should return action unchanged for isCertification if no TempPower properties are true', () => {
  const tempPower: TempPower = {
    ...mockTempPower,
    upload: false,
    attest: false
  };
  const action: TmfAction[] = ['Execute'];

  const result = isCertification(tempPower, action);

  expect(result).toEqual(['Execute']);
});


it('should add the correct actions based on TempPower properties for create, update, and delete', () => {
  const tempPower: TempPower = {
    ...mockTempPower,
    create: true,
    update: true,
    delete: true
  };
  const action: TmfAction[] = ['Execute'];

  const result = isProductOffering(tempPower, action);

  expect(result).toEqual(['Execute', 'Create', 'Update', 'Delete']);
});


it('should return action unchanged for isProductOffering if create, update, and delete are false', () => {
  const tempPower: TempPower = {
    ...mockTempPower,
    create: false,
    update: false,
    delete: false
  };
  const action: TmfAction[] = ['Create'];

  const result = isProductOffering(tempPower, action);

  expect(result).toEqual(['Create']);
});



  it('should return the correct object when function is Onboarding', () => {
    const tempPower: TempPower = {
      ...mockTempPower,
      action: '',
      domain: 'domain1',
      function: 'Onboarding',
      type: 'type1',
      execute: true
    };

    const result = service.checkFunction(tempPower);

    expect(result).toEqual({
      action: 'Execute',
      domain: 'domain1',
      function: 'Onboarding',
      type: 'type1'
    });
  });

it('should call isCertification and return the correct object when function is Certification', () => {
  const tempPower: TempPower = {
    ...mockTempPower,
    domain: 'domain2',
    function: 'Certification',
    type: 'type2',
    upload: true,
    attest: false,
    execute: false,
    create: false,
    update: false,
    delete: false
  };

  const result = service.checkFunction(tempPower);

  expect(result).toEqual({
    action: ['Upload'],
    domain: 'domain2',
    function: 'Certification',
    type: 'type2'
  });
});


  it('should call isProductOffering and return the correct object when function is ProductOffering', () => {
    const tempPower: TempPower = {
      ...mockTempPower,
      action: '',
      domain: 'domain3',
      function: 'ProductOffering',
      type: 'type3',
      create: true,
      update: true
    };

    const result = service.checkFunction(tempPower);

    expect(result).toEqual({
      action: ['Create', 'Update'],
      domain: 'domain3',
      function: 'ProductOffering',
      type: 'type3'
    });
  });

it('should return the correct object when function does not match any case', () => {
  const tempPower: TempPower = {
    ...mockTempPower,
    domain: 'domain4',
    function: 'Login', // <- no té cap cas al switch
    type: 'type4',
    execute: false,
    create: false,
    update: false,
    delete: false,
    upload: false,
    attest: false
  };

  const result = service.checkFunction(tempPower);

  expect(result).toEqual({
    action: [],
    domain: 'domain4',
    function: 'Login',
    type: 'type4'
  });
});


  it('should return true if the power is added', () => {
    // Mock data
    const existingPowers: TempPower[] = [
      { ...mockTempPower, function: 'Onboarding' },
      { ...mockTempPower, function: 'Certification' },
    ];

    const powerToCheck = 'Certification'; // Power to check

    // Mock getPlainAddedPowers to return existing powers
    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue(existingPowers);

    // Call the method with the power to check
    const result = service.checkIfPowerIsAdded(powerToCheck);

    // Verify the method returns true
    expect(result).toBe(true);
  });

  it('should return false if the power is not added', () => {
    const existingPowers: TempPower[] = [
      { ...mockTempPower, function: 'Onboarding' },
      { ...mockTempPower, function: 'Certification' },
    ];
    const powerToCheck = 'ProductOffering'; // Not in the list
    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue(existingPowers);
    const result = service.checkIfPowerIsAdded(powerToCheck);

    expect(result).toBe(false);
  });

  it('should return false if there are no added powers', () => {
    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue([]);
    const powerToCheck = 'Power2';
    const result = service.checkIfPowerIsAdded(powerToCheck);

    expect(result).toBe(false);
  });

  it('should return true if all powers have at least one valid action', () => {
    const powersWithActions: TempPower[] = [
      { ...mockTempPower, execute: true },
      { ...mockTempPower, create: true },
      { ...mockTempPower, update: true },
      { ...mockTempPower, delete: true },
      { ...mockTempPower, upload: true },
    ];

    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue(powersWithActions);

    const result = service.powersHaveFunction();

    expect(result).toBe(true);
  });

  it('should return false if any power has no valid action', () => {
    const powersWithInvalidAction: TempPower[] = [
      { ...mockTempPower, execute: true },
      { ...mockTempPower, create: true },
      { ...mockTempPower, update: true },
      { ...mockTempPower, delete: true },
      { ...mockTempPower, execute: false, create: false, update: false, delete: false, upload: false },
    ];

    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue(powersWithInvalidAction);

    const result = service.powersHaveFunction();

    expect(result).toBe(false);
  });

  it('should return true if there are no added powers (edge case)', () => {
    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue([]);
    const result = service.powersHaveFunction();

    expect(result).toBe(true);
  });

  it('should check if there are selected powers', ()=>{
    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue([]);
    let checkPowers = service.hasSelectedPower();
    expect(checkPowers).toBe(false);

    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue([{} as any]);
    checkPowers = service.hasSelectedPower();
    expect(checkPowers).toBe(true);
  });
});




