import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CredentialDetailComponent } from './credential-detail.component';
import { ActivatedRoute, provideRouter, Router, RouterLink, RouterModule } from '@angular/router';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { LEARCredentialEmployeeJwtPayload } from "../../core/models/entity/lear-credential-employee.entity";
import { LearCredentialEmployeeDataDetail } from "../../core/models/dto/lear-credential-employee-data-detail.dto";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';
import { DialogData } from 'src/app/shared/components/dialog/dialog.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { OidcSecurityService, StsConfigLoader } from 'angular-auth-oidc-client';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { FormCredentialComponent } from 'src/app/shared/components/form-credential/form-credential.component';


Object.defineProperty(window, 'location', {
  value: {
    ...window.location,
    reload: jest.fn(),
  },
  writable: true,
});

const mockCredentialManagement: LEARCredentialEmployeeJwtPayload = {

  "sub": null,
  "nbf": "2024-05-30T14:01:03.809829546Z",
  "iss": "VATES-B60645900",
  "exp": "2024-06-29T14:01:03.809829546Z",
  "iat": "2024-05-30T14:01:03.809829546Z",
  "vc": {
      "id": "78bcf8bc-6f65-4e4c-9ac2-3167cf92ad8f",
      "type": [
          "LEARCredentialEmployee",
          "VerifiableCredential"
      ],
      "credentialSubject": {
          "mandate": {
              "id": "2e29531f-1762-4dc7-8bb1-6f800e1dfd33",
              "life_span": {
                  "end_date_time": "2024-06-29T14:01:03.809829546Z",
                  "start_date_time": "2024-05-30T14:01:03.809829546Z"
              },
              "mandatee": {
                  "email": "test@test.es",
                  "first_name": "test",
                  "last_name": "test",
                  "mobile_phone": "+34 12451212"
              },
              "mandator": {
                  "commonName": "IN2",
                  "country": "ES",
                  "emailAddress": "rrhh@in2.es",
                  "organization": "IN2, Ingeniería de la Información, S.L.",
                  "organizationIdentifier": "VATES-B60645900",
                  "serialNumber": "B60645900"
              },
              "signer": {
                "commonName": "IN2",
                "country": "ES",
                "emailAddress": "rrhh@in2.es",
                "organization": "IN2, Ingeniería de la Información, S.L.",
                "organizationIdentifier": "VATES-B60645900",
                "serialNumber": "B60645900"
              },
              "power": []
          }
      },
      "expirationDate": "2024-06-29T14:01:03.809829546Z",
      "issuanceDate": "2024-05-30T14:01:03.809829546Z",
      "issuer": "VATES-B60645900",
      "validFrom": "2024-05-30T14:01:03.809829546Z"
  },
  "jti": "e2975afc-6df2-4183-b84b-d797133650eb"
}

@Component({
  selector: 'app-form-credential',
  template: '',
  standalone: true,
  inputs: ['credential']
})
class MockFormCredentialComponent {
  @Input() title: any;
  @Input() isDisabled: any;
  @Input() credential: any;
  @Input() power: any;
  @Input() mandator: any;
  @Input() credentialStatus: any;
  @Input() viewMode: any;
  @Output() sendReminder = new EventEmitter<void>();
}

describe('CredentialDetailComponent', () => {
  let router: { navigate:jest.Mock };
  let component: CredentialDetailComponent;
  let fixture: ComponentFixture<CredentialDetailComponent>;
  let mockCredentialProcedureService: {
    getCredentialProcedureById: jest.Mock;
    sendReminder: jest.Mock;
  };
  let dialogService: {
    openDialog: jest.Mock,
    openDialogWithCallback: jest.Mock
  }
  let translateService:TranslateService;
  let configService: any

  let oidcSecurityService: {
    checkAuth: jest.Mock,
    authorize: jest.Mock,
    logoff: jest.Mock
  };

  const mockAuthResponse = {
    isAuthenticated: false,
    userData: { emailAddress: 'test@example.com' },
    accessToken: 'dummyAccessToken',
    idToken: 'dummyIdToken'
  };

  beforeEach(async () => {
    mockCredentialProcedureService = {
      getCredentialProcedureById: jest.fn(),
      sendReminder: jest.fn()
    };
    dialogService = {
      openDialog: jest.fn(),
      openDialogWithCallback: jest.fn()
    }
    router = {
      navigate: jest.fn().mockResolvedValue(() => Promise.resolve(undefined))
    }
    configService = { loadConfigs:() => {} };

    oidcSecurityService = {
      checkAuth: jest.fn().mockReturnValue(of(mockAuthResponse)),
      authorize: jest.fn(),
      logoff: jest.fn()
    };

    await TestBed.configureTestingModule({
    imports: [BrowserAnimationsModule, HttpClientModule, TranslateModule.forRoot({}), CredentialDetailComponent],
    providers: [
        AuthService,
      { provide: OidcSecurityService, useValue: oidcSecurityService },
      { provide: StsConfigLoader, useValue: configService },
        TranslateService,
        { provide: Router, useValue: router },
        { provide: DialogWrapperService, useValue: dialogService},
        { provide: CredentialProcedureService, useValue: mockCredentialProcedureService },
        {
            provide: ActivatedRoute,
            useValue: {
                paramMap: of({
                    get: (key: string) => '1',
                }),
            },
        },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
.overrideComponent(CredentialDetailComponent, {
  remove: { imports: [ FormCredentialComponent] },
  add: { imports: [ MockFormCredentialComponent ] }
})
.compileComponents();

    fixture = TestBed.createComponent(CredentialDetailComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    jest.spyOn(console, 'error');
    jest.spyOn(console, 'info');
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load credential details on init', () => {

    const mockCredential: LearCredentialEmployeeDataDetail = {
      procedure_id: '1',
      credential_status:'Active',
      credential: mockCredentialManagement,
    };

    mockCredentialProcedureService.getCredentialProcedureById.mockReturnValue(of(mockCredential));

    component.ngOnInit();

    expect(component.credentialId).toBe('1');
    expect(mockCredentialProcedureService.getCredentialProcedureById).toHaveBeenCalledWith('1');
    expect(component.credential).toEqual(mockCredential.credential);
  });

  it('should handle error while loading credential details', () => {
    mockCredentialProcedureService.getCredentialProcedureById.mockReturnValue(throwError(()=>'Error'));

    component.ngOnInit();

    expect(component.credential).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error fetching credential details', 'Error');
  });

  it('should open a dialog with correct data and callback', () => {
    jest.spyOn(translateService, 'instant').mockImplementation((key: any) => {
      if (key === 'credentialDetail.sendReminderConfirm.title') {
        return 'Mock Title';
      }
      if (key === 'credentialDetail.sendReminderConfirm.message') {
        return 'Mock Message';
      }
      return key;
    });
  
    const sendReminderSpy = jest.spyOn(component, 'sendReminder').mockReturnValue(of(true));
  
    component.openSendReminderDialog();
  
    const expectedDialogData: DialogData = {
      title: 'Mock Title',
      message: 'Mock Message',
      confirmationType: 'async',
      status: 'default'
    };
    expect(dialogService.openDialogWithCallback).toHaveBeenCalledWith(
      expectedDialogData,
      expect.any(Function)
    );
  
    const callback = dialogService.openDialogWithCallback.mock.calls[0][1];
    callback().subscribe();
  
    expect(sendReminderSpy).toHaveBeenCalled();
  });

  it('should return EMPTY and log an error if credentialId is not defined', () => {
    component.credentialId = null; 
  
    const consoleErrorSpy = jest.spyOn(console, 'error');
  
    const result = component.sendReminder();
  
    result.subscribe({
      complete: () => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('No credential id.');
        expect(mockCredentialProcedureService.sendReminder).not.toHaveBeenCalled();
        expect(dialogService.openDialogWithCallback).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
      },
    });
  });
  
  it('should send reminder, open success dialog, navigate, and reload page if credentialId is defined', fakeAsync(() => {
    component.credentialId = '123';
  
    const sendReminderSpy = mockCredentialProcedureService.sendReminder.mockReturnValue(of(null));
    const dialogRef = {
      afterClosed: jest.fn().mockReturnValue(of(true)),
    };
    jest.spyOn(dialogService, 'openDialog').mockReturnValue(dialogRef as any);
    const routerNavigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    const locationReloadSpy = jest.spyOn(location, 'reload').mockImplementation(() => {});
  
    const result = component.sendReminder();
  
    tick();
    result.subscribe({
      complete: () => {
        expect(sendReminderSpy).toHaveBeenCalledWith('123');
  
        const expectedDialogData: DialogData = {
          title: translateService.instant("credentialDetail.sendReminderSuccess.title"),
          message: translateService.instant("credentialDetail.sendReminderSuccess.message"),
          confirmationType: 'none',
          status: 'default'
        };
        expect(dialogService.openDialog).toHaveBeenCalledWith(expectedDialogData);
  
        expect(routerNavigateSpy).toHaveBeenCalledWith(['/organization/credentials']);
        expect(locationReloadSpy).toHaveBeenCalled();
      },
    });
    tick();
  }));

});
