import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { CredentialManagementComponent } from './credential-management.component';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthModule } from 'angular-auth-oidc-client';
import { By } from '@angular/platform-browser';

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

describe('CredentialManagementComponent', () => {
  let component: CredentialManagementComponent;
  let fixture: ComponentFixture<CredentialManagementComponent>;
  let credentialProcedureService: CredentialProcedureService;
  let credentialProcedureSpy: jest.SpyInstance;
  let authService: jest.Mocked<any>;
  let router: Router;

  beforeEach(async () => {
    authService = {
      getMandator:()=> of(null),
      getEmailName() {
        return of('User Name');
      },
      getName(){
        return of('Name')
      },
      getToken(){
        return of('token')
      },
      logout() {
        return of(void 0);
      },
      hasIn2OrganizationIdentifier(){
        return true
      }
    } as jest.Mocked<any>

    await TestBed.configureTestingModule({
    imports: [
        NoopAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
        AuthModule.forRoot({ config: {} }),
        CredentialManagementComponent
    ],
    providers: [
        CredentialProcedureService,
        Router,
        TranslateService,
        { provide: AuthService, useValue: authService },
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

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createNewCredential when the regular button is clicked', () => {
    const createNewCredentialSpy = jest.spyOn(component, 'createNewCredential');
    fixture.detectChanges();

    const createButton = fixture.debugElement.query(By.css('#create-button')).nativeElement;
    createButton.click();

    expect(createNewCredentialSpy).toHaveBeenCalled();
  });

  it('should set data sorting accessor', ()=>{
    component.ngAfterViewInit();
    const item = {
      credential_procedure: {
        procedure_id: 'Id',
      full_name: 'Name',
      status: 'Status',
      updated: 'Updated',
      credential: 'credential'
      }
    } as any;
    const resStatus = component.dataSource.sortingDataAccessor(item, 'status');
    expect(resStatus).toBe(item.credential_procedure.status.toLowerCase());

    const resName = component.dataSource.sortingDataAccessor(item, 'full_name');
    expect(resName).toBe(item.credential_procedure.full_name.toLowerCase());

    const resUpdated = component.dataSource.sortingDataAccessor(item, 'updated');
    expect(resUpdated).toBe(item.credential_procedure.updated.toLowerCase());

    const resDefault = component.dataSource.sortingDataAccessor(item, 'random');
    expect(resDefault).toBe('');
  });

});
