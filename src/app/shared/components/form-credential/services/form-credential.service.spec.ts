import {TestBed} from '@angular/core/testing';
import {FormCredentialService, isDomePlatform, isProductOffering} from './form-credential.service';
import {Power} from 'src/app/core/models/power.interface';
import {TempPower} from '../../power/power/power.component';
import {CredentialMandatee} from 'src/app/core/models/credendentialMandatee.interface';
import {Mandator} from 'src/app/core/models/madator.interface';
import {of, throwError} from 'rxjs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AuthModule} from 'angular-auth-oidc-client';
import {SharedModule} from 'src/app/shared/shared.module';
import {PopupComponent} from '../../popup/popup.component';
import {Signer} from "../../../../core/models/credentialProcedure.interface";

describe('FormCredentialService', () => {
  let service: FormCredentialService;
  let popupComponent: PopupComponent;
  let credentialProcedureService: any;
  let mockCredential: CredentialMandatee;;
  let mockSelectedCountry: string;
  let mockAddedOptions: TempPower[];
  let mockMandator: Mandator;
  let mockSigner: Signer;

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
        AuthModule.forRoot({}),
      ],
    });
    service = TestBed.inject(FormCredentialService);
    popupComponent = TestBed.inject(PopupComponent);
    credentialProcedureService = {
      createProcedure: jest.fn()
    };

    mockCredential = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '123456789',
    };
    mockSelectedCountry = '34';
    mockAddedOptions = [
      {
        tmf_action: [],
        tmf_domain: 'domain',
        tmf_function: 'function',
        tmf_type: 'type',
        execute: false,
        create: false,
        update: false,
        delete: false,
        operator: false,
        customer: false,
        provider: false,
        marketplace: false,
      },
    ];
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
    const credential: CredentialMandatee = service.resetForm();

    expect(credential.first_name).toBe('');
    expect(credential.last_name).toBe('');
    expect(credential.email).toBe('');
    expect(credential.mobile_phone).toBe('');
  });

  it('should add options correctly when not disabled', () => {
    const addedOptions: TempPower[] = [];
    const options: TempPower[] = [
      {
        tmf_action: [],
        tmf_domain: 'domain',
        tmf_function: 'function',
        tmf_type: 'type',
        execute: false,
        create: false,
        update: false,
        delete: false,
        operator: false,
        customer: false,
        provider: false,
        marketplace: false,
      },
    ];

    const result: TempPower[] = service.addOption(addedOptions, options, false);

    expect(result).toEqual(options);
  });

  it('should not add options when disabled', () => {
    const addedOptions: TempPower[] = [];
    const options: TempPower[] = [
      {
        tmf_action: [],
        tmf_domain: 'domain',
        tmf_function: 'function',
        tmf_type: 'type',
        execute: false,
        create: false,
        update: false,
        delete: false,
        operator: false,
        customer: false,
        provider: false,
        marketplace: false,
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

  it('should submit credential correctly', () => {

    jest.spyOn(service, 'resetForm');
    jest.spyOn(popupComponent, 'showPopup');
    credentialProcedureService.createProcedure.mockReturnValue(of(''));

    service.submitCredential(
      mockCredential,
      mockSelectedCountry,
      mockAddedOptions,
      mockMandator,
      mockSigner,
      credentialProcedureService as any,
      popupComponent,
      service.resetForm
    );

    expect(mockCredential.mobile_phone).toBe('+34 123456789');
    expect(credentialProcedureService.createProcedure).toHaveBeenCalled();
    expect(popupComponent.showPopup).toHaveBeenCalled();
    expect(service.resetForm).toHaveBeenCalled();
  });

  // NOUS TESTS

  it('should append country prefix to mobile_phone if not present', () => {
    const credential: CredentialMandatee = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '123456789'
    };
    
    const resetForm = jest.fn();

    credentialProcedureService.createProcedure.mockReturnValue(of({}));

    service.submitCredential(
      credential,
      mockSelectedCountry,
      mockAddedOptions,
      mockMandator,
      mockSigner,
      credentialProcedureService,
      popupComponent,
      resetForm
    );

    expect(credential.mobile_phone).toBe('+34 123456789');
    expect(credentialProcedureService.createProcedure).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });

  it('should not append country prefix to mobile_phone if already present', () => {
    
    const credential: CredentialMandatee = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '+34 123456789'
    };
    const resetForm = jest.fn();

    credentialProcedureService.createProcedure.mockReturnValue(of({}));

    service.submitCredential(
      credential,
      mockSelectedCountry,
      mockAddedOptions,
      mockMandator,
      mockSigner,
      credentialProcedureService,
      popupComponent,
      resetForm
    );

    expect(credential.mobile_phone).toBe('+34 123456789'); // No change
    expect(credentialProcedureService.createProcedure).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });

  it('should call popupComponent.showPopup on success', () => {
    const credential: CredentialMandatee = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '123456789'
    };
    const resetForm = jest.fn();

    credentialProcedureService.createProcedure.mockReturnValue(of({}));

    const popupSpy = jest.spyOn(popupComponent, 'showPopup');

    service.submitCredential(
      credential,
      mockSelectedCountry,
      mockAddedOptions,
      mockMandator,
      mockSigner,
      credentialProcedureService,
      popupComponent,
      resetForm
    );

    expect(popupSpy).toHaveBeenCalled();
  });

  it('should call popupComponent.showPopup on error', () => {
    const credential: CredentialMandatee = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '123456789'
    }
    const resetForm = jest.fn();

    credentialProcedureService.createProcedure.mockReturnValue(throwError(() => new Error('error')));

    const popupSpy = jest.spyOn(popupComponent, 'showPopup');

    service.submitCredential(
      credential,
      mockSelectedCountry,
      mockAddedOptions,
      mockMandator,
      mockSigner,
      credentialProcedureService,
      popupComponent,
      resetForm
    );

    expect(popupSpy).toHaveBeenCalled();
  });

  //TODO 
  // it('should map addedOptions to Power objects correctly', () => {
  //   const addedOptions: TempPower[] = [
  //     {
  //       tmf_action: [],
  //       tmf_domain: 'domain',
  //       tmf_function: 'DomePlatform',
  //       tmf_type: 'type',
  //       execute: false,
  //       create: true,
  //       update: true,
  //       delete: false,
  //       operator: false,
  //       customer: false,
  //       provider: false,
  //       marketplace: false
  //     }
  //   ];
 
  //   const resetForm = jest.fn();

  //   credentialProcedureService.createProcedure.mockReturnValue(of({}));

  //   service.submitCredential(
  //     mockCredential,
  //     mockSelectedCountry,
  //     addedOptions,
  //     mockMandator,
  //     mockSigner,
  //     credentialProcedureService,
  //     popupComponent,
  //     resetForm
  //   );

  //   const expectedPower = [
  //     {
  //       tmf_action: ['Create', 'Update'],
  //       tmf_domain: 'domain',
  //       tmf_function: 'DomePlatform',
  //       tmf_type: 'type'
  //     }
  //   ];

  //   expect(credentialProcedureService.createProcedure).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       payload: expect.objectContaining({
  //         power: expectedPower
  //       })
  //     })
  //   );
  // });

  it('should add "Operator" to tmf_action if option.operator is true', () => {
    const option: TempPower = {
      tmf_action: [],
      tmf_domain: 'domain',
      tmf_function: 'DomePlatform',
      tmf_type: 'type',
      execute: false,
      create: false,
      update: false,
      delete: false,
      operator: true,
      customer: false,
      provider: false,
      marketplace: false
    };

    const result = isDomePlatform(option, []);
    expect(result).toContain('Operator');
  });

  it('should add "Customer" to tmf_action if option.customer is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      customer: true
    };

    const result = isDomePlatform(option, []);
    expect(result).toContain('Customer');
  });

  it('should add "Provider" and "Marketplace" if both are true', () => {
    const option: TempPower = {
      ...mockTempPower,
      provider: true,
      marketplace: true
    };

    const result = isDomePlatform(option, []);
    expect(result).toContain('Provider');
    expect(result).toContain('Marketplace');
  });

  it('should return an empty array if no conditions are true', () => {
    const option: TempPower = {
      ...mockTempPower
    };

    const result = isDomePlatform(option, []);
    expect(result).toEqual([]);
  });
});

describe('isProductOffering', () => {
  it('should add "Create" to tmf_action if option.create is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      create: true
    };

    const result = isProductOffering(option, []);
    expect(result).toContain('Create');
  });

  it('should add "Update" to tmf_action if option.update is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      update: true
    };

    const result = isProductOffering(option, []);
    expect(result).toContain('Update');
  });

  it('should add "Delete" to tmf_action if option.delete is true', () => {
    const option: TempPower = {
      ...mockTempPower,
      delete: true
    };

    const result = isProductOffering(option, []);
    expect(result).toContain('Delete');
  });

  it('should return an empty array if no conditions are true', () => {
    const option: TempPower = {
      ...mockTempPower
    };

    const result = isProductOffering(option, []);
    expect(result).toEqual([]);
  });

});

const mockTempPower: TempPower = {
  tmf_action: [],
  tmf_domain: 'domain',
  tmf_function: 'ProductOffering',
  tmf_type: 'type',
  execute: false,
  create: false,
  update: false,
  delete: false,
  operator: false,
  customer: false,
  provider: false,
  marketplace: false
};