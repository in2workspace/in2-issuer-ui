import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredentialOfferComponent } from './credential-offer.component';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthModule } from 'angular-auth-oidc-client';

describe('CredencialOfferComponent', () => {
  let component: CredentialOfferComponent;
  let fixture: ComponentFixture<CredentialOfferComponent>;
  let credentialProcedureService: {
    getCredentialOfferByTransactionCode: jest.Mock,
    getCredentialOfferByCTransactionCode: jest.Mock
  };
  let alertService: Partial<AlertService>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    alertService = {
      showAlert:jest.fn()
    };
    credentialProcedureService = {
      getCredentialOfferByTransactionCode: jest.fn(),
      getCredentialOfferByCTransactionCode: jest.fn()
    }
    await TestBed.configureTestingModule({
    imports: [
        CommonModule,
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        AuthModule.forRoot({ config: {} }),
        CredentialOfferComponent
    ],
    providers: [
        AuthService,
        { provide: CredentialProcedureService, useValue: credentialProcedureService },
        { provide: AlertService, useValue: alertService },
        {
            provide: ActivatedRoute,
            useValue: {
                queryParams: of({ transaction_code: 'testTransactionCode' })
            }
        }
    ]
}).compileComponents();

    fixture = TestBed.createComponent(CredentialOfferComponent);
    component = fixture.componentInstance;
    alertService = TestBed.inject(AlertService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch credential offer and set qrCodeData when transaction code is present and response is valid', () => {
    const getCredOfferSpy = jest.spyOn(component, 'getCredentialOfferByTransactionCode');
    component.ngOnInit();

    expect(component.transactionCode).toBe('testTransactionCode');
    expect(getCredOfferSpy).toHaveBeenCalled();
  });

  it('should show alert when transaction code is not present', () => {
    (route.queryParams as any) = of({});

    component.ngOnInit();

    expect(alertService.showAlert).toHaveBeenCalledWith('No transaction code found in URL.', 'error');
  });

  it('should get credential offer if transaction code is present', ()=>{
    component.transactionCode='transCode';
    credentialProcedureService.getCredentialOfferByTransactionCode!.mockReturnValue(of('mockResponse'));
    component.getCredentialOfferByTransactionCode();
    expect(credentialProcedureService.getCredentialOfferByTransactionCode).toHaveBeenCalledWith('transCode');
  });

  it('should show alert when c transaction code is not present', () => {
    component.cTransactionCode=undefined;
    credentialProcedureService.getCredentialOfferByCTransactionCode!.mockReturnValue(of('mockResponse'));

    component.getCredentialOfferByCTransactionCode();

    expect(alertService.showAlert).toHaveBeenCalledWith('No c-transaction code found.', 'error');
  });

  it('should get credential offer by c-transaction code if c-transaction code is present', ()=>{
    component.cTransactionCode='cTransCode';
    credentialProcedureService.getCredentialOfferByCTransactionCode!.mockReturnValue(of('mockResponse'));
    component.getCredentialOfferByCTransactionCode();
    expect(credentialProcedureService.getCredentialOfferByCTransactionCode).toHaveBeenCalledWith('cTransCode');
  });

});
