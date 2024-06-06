import { TestBed } from '@angular/core/testing';
import { FormCredentialService } from './form-credential.service';
import { Power } from 'src/app/core/models/power.interface';
import { TempPower } from '../../power/power/power.component';
import { CredentialMandatee } from 'src/app/core/models/credendentialMandatee.interface';
import { Mandator } from 'src/app/core/models/madator.interface';
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

describe('FormCredentialService', () => {
  let service: FormCredentialService;
  let mockPopupComponent: jasmine.SpyObj<PopupComponent>;

  beforeEach(() => {
    const popupSpy = jasmine.createSpyObj('PopupComponent', ['showPopup']);

    TestBed.configureTestingModule({
      providers: [
        FormCredentialService,
        TranslateService,
        { provide: PopupComponent, useValue: popupSpy }
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
    mockPopupComponent = TestBed.inject(PopupComponent) as jasmine.SpyObj<PopupComponent>;
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
    expect(tempPower.execute).toBeTrue();
    expect(tempPower.create).toBeTrue();
    expect(tempPower.update).toBeFalse();
    expect(tempPower.delete).toBeFalse();
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
    const credential: CredentialMandatee = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      mobile_phone: '123456789',
    };
    const selectedCountry = '34';
    const addedOptions: TempPower[] = [
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
    const mandator: Mandator = {
      organizationIdentifier: '1',
      organization: 'MandatorOrg',
      commonName: 'Mandator',
      emailAddress: 'mandator@example.com',
      serialNumber: '123456',
      country: 'ES',
    };

    const credentialProcedureService = {
      saveCredentialProcedure: jasmine
        .createSpy('saveCredentialProcedure')
        .and.returnValue(of({})),
    };

    const resetForm = jasmine.createSpy('resetForm');

    service.submitCredential(
      credential,
      selectedCountry,
      addedOptions,
      mandator,
      credentialProcedureService as any,
      mockPopupComponent,
      resetForm
    );

    expect(credential.mobile_phone).toBe('+34 123456789');
    expect(credentialProcedureService.saveCredentialProcedure).toHaveBeenCalled();
    expect(mockPopupComponent.showPopup).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });

});
