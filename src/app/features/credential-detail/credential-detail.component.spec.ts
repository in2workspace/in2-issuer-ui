import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CredentialDetailComponent } from './credential-detail.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { LEARCredentialEmployeeJwtPayload } from "../../core/models/entity/lear-credential-employee.entity";
import { LearCredentialEmployeeDataDetail } from "../../core/models/dto/lear-credential-employee-data-detail.dto";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('CredentialDetailComponent', () => {
  let component: CredentialDetailComponent;
  let fixture: ComponentFixture<CredentialDetailComponent>;
  let mockCredentialProcedureService: {
    getCredentialProcedureById: jest.Mock;
    sendReminder: jest.Mock;
  };
  let translateService:TranslateService;

  beforeEach(async () => {
    mockCredentialProcedureService = {
      getCredentialProcedureById: jest.fn(),
      sendReminder: jest.fn()
    };

    await TestBed.configureTestingModule({
    imports: [BrowserAnimationsModule, RouterModule.forRoot([]), HttpClientModule, TranslateModule.forRoot({}), CredentialDetailComponent,],
    providers: [
        TranslateService,
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
}).compileComponents();

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

  it('should send reminder', () => {
    component.credentialId = '1';
    mockCredentialProcedureService.sendReminder.mockReturnValue(of('Reminder sent'));

    component.sendReminder();

    expect(mockCredentialProcedureService.sendReminder).toHaveBeenCalledWith('1');
    expect(console.info).toHaveBeenCalledWith('Reminder sent successfully', 'Reminder sent');
  });

  it('should handle error while sending reminder', () => {
    component.credentialId = '1';
    mockCredentialProcedureService.sendReminder.mockReturnValue(throwError(()=>'Error'));

    component.sendReminder();

    expect(console.error).toHaveBeenCalledWith('Error sending reminder', 'Error');
  });

  it('should set the title observable with the translated value', fakeAsync(() => {
    const mockTranslatedValue = 'Translated Credential Details';
    jest.spyOn(translateService, 'get').mockReturnValue(of(mockTranslatedValue));

    let emittedValue: string | undefined;

    component.title.subscribe((value) => {
      emittedValue = value;
    });

    tick(1000);

    expect(translateService.get).toHaveBeenCalledWith('credentialDetail.credentialDetails');
    expect(emittedValue).toBe(mockTranslatedValue);
  }));


});
