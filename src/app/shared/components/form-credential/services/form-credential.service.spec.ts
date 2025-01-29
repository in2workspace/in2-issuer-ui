import { TestBed } from '@angular/core/testing';
import { FormCredentialService, isCertification, isProductOffering } from './form-credential.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthModule } from 'angular-auth-oidc-client';
import { Mandatee, Mandator, Power, Signer } from "../../../../core/models/entity/lear-credential-employee.entity";
import { TempPower } from "../../../../core/models/temporal/temp-power.interface";
import { Country } from './country.service';

global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));

describe('FormCredentialService', () => {
  let service: FormCredentialService;
  let credentialProcedureService: any;
  let mockCredential: Mandatee;
  let mockMandateeSelectedCountry: Country;
  let mockMandator: Mandator;
  let mockSigner: Signer;
  let mockTempPower: TempPower;
  let mockAddedOptions: TempPower[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormCredentialService,
        TranslateService,
      ],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
        AuthModule.forRoot({ config: {} }),
      ],
    });
    service = TestBed.inject(FormCredentialService);
    // popupComponent = TestBed.inject(PopupComponent);
    credentialProcedureService = {
      createProcedure: jest.fn()
    };

    // Mock the return value of createProcedure
    credentialProcedureService.createProcedure = jest.fn().mockReturnValue(of({}));

    mockCredential = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '123456789',
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
      tmf_action: [],
      tmf_domain: 'domain',
      tmf_function: 'ProductOffering',
      tmf_type: 'type',
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

  it('should add a new power if not disabled', () => {
    const existingPowers: TempPower[] = [
      { ...mockTempPower, tmf_function: 'ExistingPower' }
    ];
    const newPower: TempPower = { ...mockTempPower, tmf_function: 'NewPower' };
    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue(existingPowers);
    const setAddedPowersSpy = jest.spyOn(service, 'setAddedPowers');

    service.addPower(newPower, false);

    expect(setAddedPowersSpy).toHaveBeenCalledWith([...existingPowers, newPower]);
  });

  it('should not add a new power if disabled', () => {
    const newPower: TempPower = { ...mockTempPower, tmf_function: 'NewPower' };
    const setAddedPowersSpy = jest.spyOn(service, 'setAddedPowers');

    service.addPower(newPower, true);

    expect(setAddedPowersSpy).not.toHaveBeenCalled();
  });

  it('should remove the specified power from added powers', () => {
    const existingPowers: TempPower[] = [
      { ...mockTempPower, tmf_function: 'Power1' },
      { ...mockTempPower, tmf_function: 'Power2' },
      { ...mockTempPower, tmf_function: 'Power3' },
    ];

    const powerToRemove = 'Power2';
    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue(existingPowers);
    const setAddedPowersSpy = jest.spyOn(service, 'setAddedPowers');

    service.removePower(powerToRemove);

    const expectedPowers = existingPowers.filter(
      (power) => power.tmf_function !== powerToRemove
    );
    expect(setAddedPowersSpy).toHaveBeenCalledWith(expectedPowers);
  });

  it('should not modify added powers if the specified power is not found', () => {
    const existingPowers: TempPower[] = [
      { ...mockTempPower, tmf_function: 'Power1' },
      { ...mockTempPower, tmf_function: 'Power3' },
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

  it('should convert Power to TempPower correctly', () => {
    const power: Power = {
      tmf_action: ['Execute', 'Create'],
      tmf_domain: 'domain',
      tmf_function: 'function',
      tmf_type: 'type',
    };

    const tempPower: TempPower = service.convertToTempPower(power);

    expect(tempPower.tmf_action).toEqual(['Execute', 'Create']);
    expect(tempPower.tmf_domain).toBe('domain');
    expect(tempPower.tmf_function).toBe('function');
    expect(tempPower.tmf_type).toBe('type');
    expect(tempPower.execute).toBeTruthy();
    expect(tempPower.create).toBeTruthy();
    expect(tempPower.update).toBeFalsy();
    expect(tempPower.delete).toBeFalsy();
  });

  it('should reset the form correctly', () => {
    const credential: Mandatee = service.resetForm();

    expect(credential.first_name).toBe('');
    expect(credential.last_name).toBe('');
    expect(credential.email).toBe('');
    expect(credential.mobile_phone).toBe('');
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
  jest.spyOn(service, 'checkTmfFunction');
  credentialProcedureService.createProcedure.mockReturnValue(of({}));

  service.submitCredential(
    mockCredential,
    mockMandateeSelectedCountry,
    mockMandatorCountry,
    mockAddedOptions,
    mockMandator,
    'lastName',
    mockSigner,
    credentialProcedureService as any,
    service.resetForm
  ).subscribe(() => {
    expect(credentialProcedureService.createProcedure).toHaveBeenCalledWith(
      expect.objectContaining({
        schema: 'LEARCredentialEmployee',
        format: 'jwt_vc_json',
        payload: expect.objectContaining({
          mandatee: expect.any(Object),
          mandator: expect.any(Object),
          signer: mockSigner,
          power: expect.any(Array)
        }),
        operation_mode: 'S'
      })
    );
    // expect(service.resetForm).toHaveBeenCalled();
    expect(service.checkTmfFunction).toHaveBeenCalledTimes(mockAddedOptions.length);
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
    mockMandateeSelectedCountry,
    undefined,
    mockAddedOptions,
    mockMandator,
    'lastName',
    mockSigner,
    credentialProcedureService as any,
    service.resetForm
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

it('should append country prefix to mobile_phone if not present', (done) => {
  const mockCredential = {
    mobile_phone: '123456789'
  } as Mandatee;
  const mockSelectedCountry = {
    name: 'Spain',
    phoneCode: '34',
    isoCountryCode: 'ES'
  };
  const mockAddedOptions: TempPower[] = [];
  const mockMandator = {} as Mandator;
  const mockSigner = {} as Signer;

  jest.spyOn(credentialProcedureService, 'createProcedure').mockImplementation((credentialProcedure) => {
    expect((credentialProcedure as any).payload.mandatee.mobile_phone).toBe('+34 123456789');
    return of({});
  });

  service.submitCredential(
    mockCredential,
    mockSelectedCountry,
    undefined,
    mockAddedOptions,
    mockMandator,
    'Doe',
    mockSigner,
    credentialProcedureService as any,
    jest.fn()
  ).subscribe(() => {
    done();
  }, (error) => {
    done(error);
  });
});

it('should not append country prefix to mobile_phone if already present', (done) => {
  const mockCredential = {
    mobile_phone: '+34 123456789'
  } as Mandatee;
  const mockSelectedCountry = {
    name: 'name',
    phoneCode: '34',
    isoCountryCode: 'iso'
  };
  const mockAddedOptions: TempPower[] = [];
  const mockMandator = {} as Mandator;
  const mockSigner = {} as Signer;

  jest.spyOn(credentialProcedureService, 'createProcedure').mockImplementation((credentialProcedure) => {
    expect((credentialProcedure as any).payload.mandatee.mobile_phone).toBe('+34 123456789');
    return of({});
  });

  service.submitCredential(
    mockCredential,
    mockSelectedCountry,
    undefined,
    mockAddedOptions,
    mockMandator,
    'Doe',
    mockSigner,
    credentialProcedureService as any,
    jest.fn()
  ).subscribe(() => {
    done();
  }, (error) => {
    done(error);
  });
});


  it('should map addedOptions to Power objects correctly',() => {

    const expectedPower = {
      tmf_action:'expectedAction',
      tmf_domain: 'expectedDomain',
      tmf_function: 'expectedFn',
      tmf_type: 'expectedType',
      execute: true,
    };

    const checkTmfSpy = jest.spyOn(service, 'checkTmfFunction').mockReturnValue(expectedPower);
    credentialProcedureService.createProcedure.mockReturnValue(of({}));

    service.submitCredential(
      mockCredential,
      mockMandateeSelectedCountry,
      undefined,
      mockAddedOptions,
      mockMandator,
      'lastName',
      mockSigner,
      credentialProcedureService,
      service.resetForm
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

  it('should add "Upload" to tmf_action if option.upload is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      tmf_domain: 'domain',
      tmf_function: 'Certification',
      tmf_type: 'type',
      upload: true
    };

    const result = isCertification(option, []);
    expect(result).toContain('Upload');
  });

  it('should return an empty array if no conditions are true', () => {
    const option: TempPower = {
      ...mockTempPower,
      tmf_domain: 'domain',
      tmf_function: 'ProductOffering',
      tmf_type: 'type',
    };

    const result = isCertification(option, []);
    expect(result).toEqual([]);
  });

  it('should add "Create" to tmf_action if option.create is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      tmf_domain: 'domain',
      tmf_function: 'ProductOffering',
      tmf_type: 'type',
      create: true
    };

    const result = isProductOffering(option, []);
    expect(result).toContain('Create');
  });

  it('should add "Update" to tmf_action if option.update is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      tmf_domain: 'domain',
      tmf_function: 'ProductOffering',
      tmf_type: 'type',
      update: true
    };

    const result = isProductOffering(option, []);
    expect(result).toContain('Update');
  });

  it('should add "Delete" to tmf_action if option.delete is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      tmf_domain: 'domain',
      tmf_function: 'ProductOffering',
      tmf_type: 'type',
      delete: true
    };

    const result = isProductOffering(option, []);
    expect(result).toContain('Delete');
  });

  it('should return an empty array if no conditions are true', () => {
    const option: TempPower = {
      ...mockTempPower,
      tmf_domain: 'domain',
      tmf_function: 'ProductOffering',
      tmf_type: 'type',
    };

    const result = isProductOffering(option, []);
    expect(result).toEqual([]);
  });

  it('should add the correct actions based on TempPower properties', () => {
    const tempPower: TempPower = {
      ...mockTempPower,
      tmf_action: '',
      upload: true,
    };
    const tmf_action = ['InitialAction'];

    const result = isCertification(tempPower, tmf_action);

    expect(result).toEqual(['InitialAction', 'Upload']);
  });

  it('should return tmf_action unchanged for isCertification if no TempPower properties are true', () => {
    const tempPower: TempPower = {
      ...mockTempPower,
      tmf_action: ''
    };
    const tmf_action = ['InitialAction'];

    const result = isCertification(tempPower, tmf_action);

    expect(result).toEqual(['InitialAction']);
  });

  it('should add the correct actions based on TempPower properties for create, update, and delete', () => {
    const tempPower: TempPower = {
      ...mockTempPower,
      tmf_action: '',
      create: true,
      update: true,
      delete: true,
    };
    const tmf_action = ['InitialAction'];

    const result = isProductOffering(tempPower, tmf_action);

    expect(result).toEqual(['InitialAction', 'Create', 'Update', 'Delete']);
  });

  it('should return tmf_action unchanged for isProductOffering if create, update, and delete are false', () => {
    const tempPower: TempPower = {
      ...mockTempPower,
      tmf_action: ''
    };
    const tmf_action = ['InitialAction'];

    const result = isProductOffering(tempPower, tmf_action);

    expect(result).toEqual(['InitialAction']);
  });

  it('should return the correct object when tmf_function is Onboarding', () => {
    const tempPower: TempPower = {
      ...mockTempPower,
      tmf_action: '',
      tmf_domain: 'domain1',
      tmf_function: 'Onboarding',
      tmf_type: 'type1',
      execute: true
    };

    const result = service.checkTmfFunction(tempPower);

    expect(result).toEqual({
      tmf_action: 'Execute',
      tmf_domain: 'domain1',
      tmf_function: 'Onboarding',
      tmf_type: 'type1'
    });
  });

  it('should call isCertification and return the correct object when tmf_function is Certification', () => {
    const tempPower: TempPower = {
      ...mockTempPower,
      tmf_action: '',
      tmf_domain: 'domain2',
      tmf_function: 'Certification',
      tmf_type: 'type2',
      upload: true
    };

    const result = service.checkTmfFunction(tempPower);

    expect(result).toEqual({
      tmf_action: ['Upload'],
      tmf_domain: 'domain2',
      tmf_function: 'Certification',
      tmf_type: 'type2'
    });
  });

  it('should call isProductOffering and return the correct object when tmf_function is ProductOffering', () => {
    const tempPower: TempPower = {
      ...mockTempPower,
      tmf_action: '',
      tmf_domain: 'domain3',
      tmf_function: 'ProductOffering',
      tmf_type: 'type3',
      create: true,
      update: true
    };

    const result = service.checkTmfFunction(tempPower);

    expect(result).toEqual({
      tmf_action: ['Create', 'Update'],
      tmf_domain: 'domain3',
      tmf_function: 'ProductOffering',
      tmf_type: 'type3'
    });
  });

  it('should return the correct object when tmf_function does not match any case', () => {
    const tempPower: TempPower = {
      ...mockTempPower,
      tmf_action: '',
      tmf_domain: 'domain4',
      tmf_function: 'UnknownFunction',
      tmf_type: 'type4'
    };

    const result = service.checkTmfFunction(tempPower);

    expect(result).toEqual({
      tmf_action: [],
      tmf_domain: 'domain4',
      tmf_function: 'UnknownFunction',
      tmf_type: 'type4'
    });
  });

  it('should return true if the power is added', () => {
    // Mock data
    const existingPowers: TempPower[] = [
      { ...mockTempPower, tmf_function: 'Power1' },
      { ...mockTempPower, tmf_function: 'Power2' },
    ];

    const powerToCheck = 'Power2';

    // Mock getPlainAddedPowers to return existing powers
    jest.spyOn(service, 'getPlainAddedPowers').mockReturnValue(existingPowers);

    // Call the method with the power to check
    const result = service.checkIfPowerIsAdded(powerToCheck);

    // Verify the method returns true
    expect(result).toBe(true);
  });

  it('should return false if the power is not added', () => {
    const existingPowers: TempPower[] = [
      { ...mockTempPower, tmf_function: 'Power1' },
      { ...mockTempPower, tmf_function: 'Power3' },
    ];
    const powerToCheck = 'Power2'; // Not in the list
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




