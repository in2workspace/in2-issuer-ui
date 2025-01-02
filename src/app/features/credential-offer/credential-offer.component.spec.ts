import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredentialOfferComponent } from './credential-offer.component';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthModule } from 'angular-auth-oidc-client';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';

describe('CredencialOfferComponent', () => {
  let component: CredentialOfferComponent;
  let fixture: ComponentFixture<CredentialOfferComponent>;
  let translate: TranslateService;
  let credentialProcedureService: {
    getCredentialOfferByTransactionCode: jest.Mock,
    getCredentialOfferByCTransactionCode: jest.Mock
  };
  let dialogService: {
    openErrorInfoDialog: jest.Mock,
  };
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    dialogService = {
      openErrorInfoDialog:jest.fn()
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
        TranslateService,
        { provide: CredentialProcedureService, useValue: credentialProcedureService },
        { provide: DialogWrapperService, useValue: dialogService },
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
    translate = TestBed.inject(TranslateService);
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

  it('should show alert dialog when transaction code is not present', () => {
    (route.queryParams as any) = of({});
    const translatedMessage = translate.instant('error.credentialOffer.no_transaction_code');

    component.ngOnInit();

    expect(dialogService.openErrorInfoDialog).toHaveBeenCalledWith(translatedMessage);
  });

  it('should get credential offer if transaction code is present', ()=>{
    component.transactionCode='transCode';
    credentialProcedureService.getCredentialOfferByTransactionCode!.mockReturnValue(of('mockResponse'));
    component.getCredentialOfferByTransactionCode();
    expect(credentialProcedureService.getCredentialOfferByTransactionCode).toHaveBeenCalledWith('transCode');
  });

  it('should show alert dialog when c transaction code is not present', () => {
    component.cTransactionCode=undefined;
    const translatedMessage = translate.instant('error.credentialOffer.no_transaction_code');
    credentialProcedureService.getCredentialOfferByCTransactionCode!.mockReturnValue(of('mockResponse'));

    component.getCredentialOfferByCTransactionCode();

    expect(dialogService.openErrorInfoDialog).toHaveBeenCalledWith(translatedMessage);
  });

  it('should get credential offer by c-transaction code if c-transaction code is present', ()=>{
    component.cTransactionCode='cTransCode';
    credentialProcedureService.getCredentialOfferByCTransactionCode!.mockReturnValue(of('mockResponse'));
    component.getCredentialOfferByCTransactionCode();
    expect(credentialProcedureService.getCredentialOfferByCTransactionCode).toHaveBeenCalledWith('cTransCode');
  });
});
