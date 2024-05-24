import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CredentialDetailComponent } from './credential-detail.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { CredentialProcedure } from 'src/app/core/models/credentialProcedure.interface';
import { CredentialManagement } from 'src/app/core/models/credentialManagement.interface';

describe('CredentialDetailComponent', () => {
  let component: CredentialDetailComponent;
  let fixture: ComponentFixture<CredentialDetailComponent>;
  let mockCredentialProcedureService: jasmine.SpyObj<CredentialProcedureService>;

  beforeEach(async () => {
    mockCredentialProcedureService = jasmine.createSpyObj('CredentialProcedureService', ['getCredentialProcedureById', 'sendReminder']);

    await TestBed.configureTestingModule({
      declarations: [CredentialDetailComponent],
      imports: [BrowserAnimationsModule, RouterModule.forRoot([]), HttpClientModule],
      providers: [
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load credential details on init', () => {
    const mockCredentialManagement: CredentialManagement = {
      mandator: {
        organizationIdentifier: 'org-123',
        organization: 'Test Organization',
        commonName: 'Test Common Name',
        emailAddress: 'test@example.com',
        serialNumber: 'SN123456',
        country: 'CountryA'
      },
      mandatee: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        mobile_phone: '123-456-7890'
      },
      power: [
        {
          tmf_action: ['action1', 'action2'],
          tmf_domain: 'domain1',
          tmf_function: 'function1',
          tmf_type: 'type1'
        }
      ]
    };

    const mockCredential: CredentialProcedure = {
      procedure_id: '1',
      full_name: 'Test Credential',
      status: 'Active',
      updated: new Date().toISOString(),
      credential: mockCredentialManagement,
    };

    mockCredentialProcedureService.getCredentialProcedureById.and.returnValue(of([mockCredential]));

    component.ngOnInit();

    expect(component.credentialId).toBe('1');
    expect(mockCredentialProcedureService.getCredentialProcedureById).toHaveBeenCalledWith('1');
    expect(component.credential).toEqual(mockCredential);
  });

  it('should handle error while loading credential details', () => {
    spyOn(console, 'error');
    mockCredentialProcedureService.getCredentialProcedureById.and.returnValue(throwError('Error'));

    component.ngOnInit();

    expect(component.credential).toBeNull();
    expect(console.error).toHaveBeenCalledWith('Error fetching credential details', 'Error');
  });

  it('should send reminder', () => {
    component.credentialId = '1';
    mockCredentialProcedureService.sendReminder.and.returnValue(of('Reminder sent'));

    spyOn(console, 'log');
    component.sendReminder();

    expect(mockCredentialProcedureService.sendReminder).toHaveBeenCalledWith('1');
    expect(console.log).toHaveBeenCalledWith('Reminder sent successfully', 'Reminder sent');
  });

  it('should handle error while sending reminder', () => {
    component.credentialId = '1';
    mockCredentialProcedureService.sendReminder.and.returnValue(throwError('Error'));

    spyOn(console, 'error');
    component.sendReminder();

    expect(console.error).toHaveBeenCalledWith('Error sending reminder', 'Error');
  });
});
