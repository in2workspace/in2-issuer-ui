import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredencialOfferComponent } from './credencial-offer.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/core/services/auth.service';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthModule, StsConfigLoader, StsConfigStaticLoader } from 'angular-auth-oidc-client';

describe('CredencialOfferComponent', () => {
  let component: CredencialOfferComponent;
  let fixture: ComponentFixture<CredencialOfferComponent>;
  let credentialProcedureService: CredentialProcedureService;
  let alertService: AlertService;
  let route: ActivatedRoute;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CredencialOfferComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MaterialModule,
        SharedModule,
        AuthModule.forRoot({

        }),
      ],
      providers: [
        AuthService,
        CredentialProcedureService,
        AlertService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ transaction_code: 'testTransactionCode' })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredencialOfferComponent);
    component = fixture.componentInstance;
    credentialProcedureService = TestBed.inject(CredentialProcedureService);
    alertService = TestBed.inject(AlertService);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch credential offer and set qrCodeData when transaction code is present and response is valid', () => {
    const spyRouterNavigate = spyOn(router, 'navigate');
    const mockResponse = 'mockQRCodeData';
    spyOn(credentialProcedureService, 'getCredentialOffer').and.returnValue(of(mockResponse));

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
    const spyAlertService = spyOn(alertService, 'showAlert');
    (route.queryParams as any) = of({});

    component.ngOnInit();

    expect(spyAlertService).toHaveBeenCalledWith('No transaction code found in URL.', 'error');
  });

  // it('should show alert when no QR code is available', () => {
  //   spyOn(credentialProcedureService, 'getCredentialOffer').and.returnValue(of(''));
  //   const spyAlertService = spyOn(alertService, 'showAlert');

  //   component.ngOnInit();
  //   fixture.detectChanges();

  //   expect(credentialProcedureService.getCredentialOffer).toHaveBeenCalledWith('testTransactionCode');
  //   expect(component.qrCodeData).toBe('');
  //   expect(spyAlertService).toHaveBeenCalledWith('No QR code available.', 'error');
  // });

  it('should show alert when there is an error fetching credential offer', () => {
    const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    spyOn(credentialProcedureService, 'getCredentialOffer').and.returnValue(throwError(() => errorResponse));
    const spyAlertService = spyOn(alertService, 'showAlert');

    component.ngOnInit();

    expect(credentialProcedureService.getCredentialOffer).toHaveBeenCalledWith('testTransactionCode');
    expect(spyAlertService).toHaveBeenCalledWith('Error fetching credential offer.', 'error');
  });
});
