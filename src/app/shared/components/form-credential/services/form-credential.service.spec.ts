import { TestBed } from '@angular/core/testing';
import { FormCredentialService, isCertification, isProductOffering } from './form-credential.service';
import { of, throwError } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthModule } from 'angular-auth-oidc-client';
import { SharedModule } from 'src/app/shared/shared.module';
import { PopupComponent } from '../../popup/popup.component';
import { TempPower } from "../../../../core/models/tempPower.interface";
import { Mandatee, Mandator, Power, Signer } from "../../../../core/models/vc/learCredential.interface";

describe('FormCredentialService', () => {
  let service: FormCredentialService;
  let popupComponent: PopupComponent;
  let credentialProcedureService: any;
  let mockCredential: Mandatee;
  let mockSelectedCountry: string;
  let mockMandator: Mandator;
  let mockSigner: Signer;
  let mockTempPower: TempPower;
  let mockAddedOptions: TempPower[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormCredentialService,
        TranslateService,
        PopupComponent
      ],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        SharedModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
        AuthModule.forRoot({ config: {} }),
      ],
    });
    service = TestBed.inject(FormCredentialService);
    popupComponent = TestBed.inject(PopupComponent);
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
    mockSelectedCountry = '34';
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

  it('should be created', () => {
    expect(service).toBeTruthy();
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

  it('should add options correctly when not disabled', () => {
    const addedOptions: TempPower[] = [];
    const options: TempPower[] = [
      {
        ...mockTempPower,
        tmf_domain: 'domain',
        tmf_function: 'function',
        tmf_type: 'type'
      },
    ];

    const result: TempPower[] = service.addOption(addedOptions, options, false);

    expect(result).toEqual(options);
  });

  it('should not add options when disabled', () => {
    const addedOptions: TempPower[] = [];
    const options: TempPower[] = [
      {
        ...mockTempPower,
        tmf_domain: 'domain',
        tmf_function: 'function',
        tmf_type: 'type'
      },
    ];

    const result: TempPower[] = service.addOption(addedOptions, options, true);

    expect(result).toEqual(addedOptions);
  });

  it('should handle select change correctly', () => {
    const event = { target: { value: 'newValue' } } as unknown as Event;

    const result: string = service.handleSelectChange(event);

    expect(result).toBe('newValue');
  });

  it('should submit credential correctly', (done) => {
    jest.spyOn(service, 'resetForm');
    jest.spyOn(popupComponent, 'showPopup');
    credentialProcedureService.createProcedure.mockReturnValue(of({}));

    service.submitCredential(
      mockCredential,
      mockSelectedCountry,
      mockAddedOptions,
      mockMandator,
      mockSigner,
      credentialProcedureService as any,
      popupComponent,
      service.resetForm
    ).subscribe(() => {
      expect(mockCredential.mobile_phone).toBe('+34 123456789');
      expect(credentialProcedureService.createProcedure).toHaveBeenCalled();
      expect(popupComponent.showPopup).toHaveBeenCalled();
      expect(service.resetForm).toHaveBeenCalled();
      done(); // Ensure the test completes after assertions
    });
  });

  it('should append country prefix to mobile_phone if not present', (done) => {
    const credential: Mandatee = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '123456789',
    };

    credentialProcedureService.createProcedure.mockReturnValue(of({}));

    service.submitCredential(
      credential,
      mockSelectedCountry,
      mockAddedOptions,
      mockMandator,
      mockSigner,
      credentialProcedureService,
      popupComponent,
      jest.fn()
    ).subscribe(() => {
      expect(credential.mobile_phone).toBe('+34 123456789');
      expect(credentialProcedureService.createProcedure).toHaveBeenCalled();
      done();
    });
  });

  it('should not append country prefix to mobile_phone if already present', (done) => {
    const credential: Mandatee = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '+34 123456789', // Already has country prefix
    };
    const resetForm = jest.fn();

    credentialProcedureService.createProcedure.mockReturnValue(of({})); // Mock Observable return

    service.submitCredential(
      credential,
      mockSelectedCountry,
      mockAddedOptions,
      mockMandator,
      mockSigner,
      credentialProcedureService,
      popupComponent,
      resetForm
    ).subscribe(() => {
      expect(credential.mobile_phone).toBe('+34 123456789'); // Ensure prefix is unchanged
      expect(credentialProcedureService.createProcedure).toHaveBeenCalled(); // Check createProcedure was called
      expect(resetForm).toHaveBeenCalled(); // Ensure resetForm was called
      done(); // Mark the test as completed
    });
  });

  it('should call popupComponent.showPopup on success', (done) => {
    jest.spyOn(popupComponent, 'showPopup');
    credentialProcedureService.createProcedure.mockReturnValue(of({}));

    service.submitCredential(
      mockCredential,
      mockSelectedCountry,
      mockAddedOptions,
      mockMandator,
      mockSigner,
      credentialProcedureService,
      popupComponent,
      jest.fn()
    ).subscribe(() => {
      expect(popupComponent.showPopup).toHaveBeenCalled();
      done();
    });
  });

  it('should call popupComponent.showPopup on error', (done) => {
    jest.spyOn(popupComponent, 'showPopup');
    credentialProcedureService.createProcedure.mockReturnValue(throwError(() => new Error('error')));

    service.submitCredential(
      mockCredential,
      mockSelectedCountry,
      mockAddedOptions,
      mockMandator,
      mockSigner,
      credentialProcedureService,
      popupComponent,
      jest.fn()
    ).subscribe({
      error: () => {
        expect(popupComponent.showPopup).toHaveBeenCalled();
        done();
      }
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
      mockSelectedCountry,
      mockAddedOptions,
      mockMandator,
      mockSigner,
      credentialProcedureService,
      popupComponent,
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
    checkTmfSpy.mockRestore();
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
});




