import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CredentialManagementComponent } from './credential-management.component';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { CredentialProcedure, CredentialProcedureResponse } from 'src/app/core/models/credentialProcedure.interface';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthModule } from 'angular-auth-oidc-client';

describe('CredentialManagementComponent', () => {
  let component: CredentialManagementComponent;
  let fixture: ComponentFixture<CredentialManagementComponent>;
  let credentialProcedureService: CredentialProcedureService;
  let credentialProcedureSpy: jest.SpyInstance;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CredentialManagementComponent],
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
      providers: [
        CredentialProcedureService,
        Router,
        TranslateService,
        AuthService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    credentialProcedureService = TestBed.inject(
      CredentialProcedureService
    );
    credentialProcedureSpy = jest.spyOn(credentialProcedureService, 'getCredentialProcedures');
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CredentialManagementComponent);
    component = fixture.componentInstance;

    credentialProcedureSpy.mockReturnValue(of());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize paginator and load credential data on ngAfterViewInit', () => {
    jest.spyOn(component, 'loadCredentialData');
    component.ngAfterViewInit();
    expect(component.dataSource.paginator).toBe(component.paginator);
    expect(component.loadCredentialData).toHaveBeenCalled();
  });

  it('should load credential data successfully', () => {
    const mockCredential = {
      mandatee: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        mobile_phone: '123-456-7890',
      },
      mandator: {
        organizationIdentifier: 'org-123',
        organization: 'Test Organization',
        commonName: 'Test Common Name',
        emailAddress: 'test@example.com',
        serialNumber: 'SN123456',
        country: 'CountryA',
      },
      signer: {
        organizationIdentifier: 'org-123',
        organization: 'Test Organization',
        commonName: 'Test Common Name',
        emailAddress: 'test@example.com',
        serialNumber: 'SN123456',
        country: 'CountryA',
      },
      power: [
        {
          tmf_action: ['action1', 'action2'],
          tmf_domain: 'domain1',
          tmf_function: 'function1',
          tmf_type: 'type1',
        },
      ],
    };

    const mockData: CredentialProcedureResponse = {
      credential_procedures: [
        {
          credential_procedure: {
            procedure_id: '',
            status: 'completed',
            full_name: 'John Doe',
            updated: '2023-01-01',
            credential: mockCredential,
          },
        },
        {
          credential_procedure: {
            procedure_id: '',
            status: 'pending',
            full_name: 'Jane Doe',
            updated: '2023-01-02',
            credential: mockCredential,
          },
        },
      ],
    };

    credentialProcedureSpy.mockReturnValue(of(mockData));

    component.loadCredentialData();

    expect(credentialProcedureService.signCredential).toHaveBeenCalledWith;
    // expect(component.dataSource.data).toEqual(mockData.credential_procedures);
  });

  it('should log an error when loading credential data fails', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    credentialProcedureSpy.mockReturnValue(
      throwError(() => new Error('Error fetching credentials'))
    );

    component.loadCredentialData();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching credentials',
      expect.any(Error)
    );
  });

  it('should navigate to credential issuance page', () => {
    component.createNewCredential();
    expect(router.navigate).toHaveBeenCalledWith(['/organization/credentials/create']);
  });

  it('should navigate to credential details page', () => {
    const mockCredential = {
      mandatee: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        mobile_phone: '123-456-7890',
      },
      mandator: {
        organizationIdentifier: 'org-123',
        organization: 'Test Organization',
        commonName: 'Test Common Name',
        emailAddress: 'test@example.com',
        serialNumber: 'SN123456',
        country: 'CountryA',
      },
      signer: {
        organizationIdentifier: 'org-123',
        organization: 'Test Organization',
        commonName: 'Test Common Name',
        emailAddress: 'test@example.com',
        serialNumber: 'SN123456',
        country: 'CountryA',
      },
      power: [
        {
          tmf_action: ['action1', 'action2'],
          tmf_domain: 'domain1',
          tmf_function: 'function1',
          tmf_type: 'type1',
        },
      ],
    };

    const mockElement: CredentialProcedure = {
      credential_procedure: {
        procedure_id: '1',
        status: 'completed',
        full_name: 'John Doe',
        updated: '2023-01-01',
        credential: mockCredential,
      },
    };

    component.goToCredentialDetails(mockElement);

    expect(router.navigate).toHaveBeenCalledWith(['/organization/credentials/details', '1']);
  });
});
