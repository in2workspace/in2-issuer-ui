import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
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
        MatButtonModule,
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

  // it('should initialize paginator, sort, and load credential data on ngAfterViewInit', () => {
  //   jest.spyOn(component, 'loadCredentialData');
  //   component.ngAfterViewInit();

  //   expect(component.dataSource.paginator).toBe(component.paginator);
  //   expect(component.dataSource.sort).toEqual(component.sort);
  //   expect(component.isValidOrganizationIdentifier).toBe(true);
  //   expect(component.loadCredentialData).toHaveBeenCalled();

  // });

  // // it('should not add "actions" to displayedColumns if role is "admin"', ()=>{
  // //   authServiceRoleSpy.mockReturnValue('admin');
  // //   component.ngAfterViewInit();
  // //   expect(component.displayedColumns).not.toContain('actions');
  // // });

  // it('should not add "actions" to displayedColumns if role is not "admin"', () => {
  //   component.ngAfterViewInit();
  //   expect(component.displayedColumns).not.toContain('actions');
  // });

  // // it('should load credential data successfully', () => {

  // //   const mockData: CredentialProcedureResponse = {
  // //     credential_procedures: [
  // //       {
  // //         credential_procedure: {
  // //           procedure_id: '',
  // //           status: 'completed',
  // //           full_name: 'John Doe',
  // //           updated: '2023-01-01',
  // //           credential: mockCredential,
  // //         },
  // //       },
  // //       {
  // //         credential_procedure: {
  // //           procedure_id: '',
  // //           status: 'pending',
  // //           full_name: 'Jane Doe',
  // //           updated: '2023-01-02',
  // //           credential: mockCredential,
  // //         },
  // //       },
  // //     ],
  // //   };

  // //   credentialProcedureSpy.mockReturnValue(of(mockData));

  // //   component.loadCredentialData();

  // //   expect(credentialProcedureService.signCredential).toHaveBeenCalledWith;
  // //   // expect(component.dataSource.data).toEqual(mockData.credential_procedures);
  // // });

  // it('should log an error when loading credential data fails', () => {
  //   const consoleErrorSpy = jest.spyOn(console, 'error');
  //   credentialProcedureSpy.mockReturnValue(
  //     throwError(() => new Error('Error fetching credentials'))
  //   );

  //   component.loadCredentialData();

  //   expect(consoleErrorSpy).toHaveBeenCalledWith(
  //     'Error fetching credentials',
  //     expect.any(Error)
  //   );
  // });

  // it('should navigate to credential issuance page', () => {
  //   component.createNewCredential();
  //   expect(router.navigate).toHaveBeenCalledWith(['/organization/credentials/create']);
  // });

  // // it('should navigate to credential issuance page 2', () => {
  // //   component.createNewCredential2();
  // //   expect(router.navigate).toHaveBeenCalledWith(['/organization/credentials/create2',component.rol]);
  // // });

  // it('should navigate to credential details page', () => {

  //   const mockElement: CredentialProcedure = {
  //     credential_procedure: {
  //       procedure_id: '1',
  //       status: 'completed',
  //       full_name: 'John Doe',
  //       updated: '2023-01-01',
  //       credential: mockCredential,
  //     },
  //   };

  //   component.goToCredentialDetails(mockElement);

  //   expect(router.navigate).toHaveBeenCalledWith(['/organization/credentials/details', '1']);
  // });

  // it('should call signCredential and log "firma enviada" on success', () => {
  //   const mockElement = {
  //     credential_procedure: {
  //       procedure_id: '12345'
  //     }
  //   };

  //   const signCredentialSpy = jest.spyOn(credentialProcedureService, 'signCredential').mockReturnValue(of({}));

  //   const consoleLogSpy = jest.spyOn(console, 'log');

  //   component.performAction(mockElement);

  //   expect(signCredentialSpy).toHaveBeenCalledWith('12345');
  //   expect(consoleLogSpy).toHaveBeenCalledWith('firma enviada');
  // });

  // it('should call signCredential and log "firma no enviada" on error', () => {
  //   const mockElement = {
  //     credential_procedure: {
  //       procedure_id: '12345'
  //     }
  //   };

  //   const signCredentialSpy = jest.spyOn(credentialProcedureService, 'signCredential').mockReturnValue(
  //     throwError(() => new Error('Error en el servei'))
  //   );

  //   const consoleLogSpy = jest.spyOn(console, 'log');

  //   component.performAction(mockElement);

  //   expect(signCredentialSpy).toHaveBeenCalledWith('12345');
  //   expect(consoleLogSpy).toHaveBeenCalledWith('firma no enviada');
  // });

  //TEMPLATE
  // it('should show the admin button and not show column when role is "admin"', async () => {
  //   // component.rol = 'admin';
  //   //component.displayedColumns.push('actions');
  //   fixture.detectChanges();

  //   await fixture.whenStable(); // Esperar que el cicle de canvi estigui complet

  //   const adminButton = fixture.debugElement.query(By.css("#admin-button"));
  //   expect(adminButton).toBeTruthy();

  //   const adminColumn = fixture.debugElement.query(By.css('#actions-column'));
  //   expect(adminColumn).toBeNull();
  // });

  // it('should show the admin column when role is "local-signer"', async () => {
  //   // component.rol = 'local-signer';
  //   component.displayedColumns.push('actions');
  //   fixture.detectChanges();

  //   await fixture.whenStable(); // Esperar que el cicle de canvi estigui complet

  //   const adminColumn = fixture.debugElement.query(By.css('#actions-column'));
  //   expect(adminColumn).toBeTruthy();
  // });

  // it('should not show the admin button when role is not "admin"', () => {
  //   component.rol = 'user';
  //   fixture.detectChanges();

  //   const adminButton = fixture.debugElement.query(By.css('#actions-column'));
  //   expect(adminButton).toBeNull();

  //   const adminColumn = fixture.debugElement.query(By.css('#admin-column'));
  //   expect(adminColumn).toBeNull();
  // });

  it('should call createNewCredential when the regular button is clicked', () => {
    const createNewCredentialSpy = jest.spyOn(component, 'createNewCredential');
    fixture.detectChanges();


    const createButton = fixture.debugElement.query(By.css('#create-button')).nativeElement;
    createButton.click();


    expect(createNewCredentialSpy).toHaveBeenCalled();
  });

  // it('should call createNewCredential2 when the admin button is clicked', () => {
  //   component.rol = 'admin';
  //   fixture.detectChanges();

  //   const createNewCredential2Spy = jest.spyOn(component, 'createNewCredential2');
  //   const adminButton = fixture.debugElement.query(By.css('#admin-button')).nativeElement;
  //   adminButton.click();

  //   expect(createNewCredential2Spy).toHaveBeenCalled();
  // });

  it('should set data sorting accessor', ()=>{
    component.ngAfterViewInit();
    const item = {
      credential_procedure: {
        procedure_id: 'Id',
        subject: 'Name',
        status: 'Status',
        updated: 'Updated',
        credential_type: 'Type'
      }
    } as any;
    const resStatus = component.dataSource.sortingDataAccessor(item, 'status');
    expect(resStatus).toBe(item.credential_procedure.status.toLowerCase());

    const resName = component.dataSource.sortingDataAccessor(item, 'subject');
    expect(resName).toBe(item.credential_procedure.subject.toLowerCase());

    const resUpdated = component.dataSource.sortingDataAccessor(item, 'updated');
    expect(resUpdated).toBe(item.credential_procedure.updated.toLowerCase());

    const resType = component.dataSource.sortingDataAccessor(item, 'credential_type');
    expect(resType).toBe(item.credential_procedure.credential_type.toLowerCase());

    const resDefault = component.dataSource.sortingDataAccessor(item, 'random');
    expect(resDefault).toBe('');
  });

});
