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
    getCredentialOffer: jest.Mock
  };
  let alertService: Partial<AlertService>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    alertService = {
      showAlert:jest.fn()
    };
    credentialProcedureService = {
      getCredentialOffer: jest.fn()
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
    const spyRouterNavigate = jest.spyOn(router, 'navigate');
    const mockResponse = 'mockQRCodeData';
    credentialProcedureService.getCredentialOffer!.mockReturnValue(of(mockResponse));

    component.ngOnInit();

    expect(credentialProcedureService.getCredentialOffer).toHaveBeenCalledWith('testTransactionCode');
    expect(component.qrCodeData).toBe(mockResponse);
    expect(spyRouterNavigate).toHaveBeenCalledWith([], {
      relativeTo: route,
      queryParams: { transaction_code: 'testTransactionCode' },
      queryParamsHandling: 'merge'
    });
  });

  it('should show alert when transaction code is not present', () => {
    (route.queryParams as any) = of({});

    component.ngOnInit();

    expect(alertService.showAlert).toHaveBeenCalledWith('No transaction code found in URL.', 'error');
  });

  it('should show alert when there is an error fetching credential offer', () => {
    const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    credentialProcedureService.getCredentialOffer.mockReturnValue(throwError(() => errorResponse));

    component.ngOnInit();

    expect(credentialProcedureService.getCredentialOffer).toHaveBeenCalledWith('testTransactionCode');
    expect(alertService.showAlert).toHaveBeenCalledWith('The credential offer is expired or already used.', 'error');
  });

  it('should fetch credential offer and set qrCodeData when transaction code is present and response is valid', () => {
    const spyRouterNavigate = jest.spyOn(router, 'navigate');
    const mockResponse = 'mockQRCodeData';

    credentialProcedureService.getCredentialOffer!.mockReturnValue(of(mockResponse));

    component.ngOnInit();

    expect(credentialProcedureService.getCredentialOffer).toHaveBeenCalledWith('testTransactionCode');
    expect(component.qrCodeData).toBe(mockResponse);
    expect(spyRouterNavigate).toHaveBeenCalledWith([], {
      relativeTo: route,
      queryParams: { transaction_code: 'testTransactionCode' },
      queryParamsHandling: 'merge'
    });
  });

  it('should show alert when no data is returned from getCredentialOffer', () => {
    credentialProcedureService.getCredentialOffer!.mockReturnValue(of(null));

    component.ngOnInit();

    expect(credentialProcedureService.getCredentialOffer).toHaveBeenCalledWith('testTransactionCode');
    expect(alertService.showAlert).toHaveBeenCalledWith('No QR code available.', 'error');
  });
});
