import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CredentialOfferStepperComponent } from './credential-offer-stepper.component';
import { of, Subject, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { OidcSecurityService, StsConfigLoader } from 'angular-auth-oidc-client';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const mockAuthResponse = {
  isAuthenticated: false,
  userData: { emailAddress: 'test@example.com' },
  accessToken: 'dummyAccessToken',
  idToken: 'dummyIdToken'
};

describe('CredentialOfferStepperComponent', () => {
  let activatedRoute: { snapshot: any }
  let component: CredentialOfferStepperComponent;
  let fixture: ComponentFixture<CredentialOfferStepperComponent>;
  let credentialProcedureService: jest.Mocked<CredentialProcedureService>;
  let dialogWrapperService: jest.Mocked<DialogWrapperService>;
  let breakpointObserver: jest.Mocked<BreakpointObserver>;
  let routerMock: jest.Mocked<any>;
  let oidcSecurityService: {
    checkAuth: jest.Mock,
    authorize: jest.Mock,
    logoff: jest.Mock
  };
  let configService: any

  beforeEach(async () => {
    activatedRoute = { snapshot: {}};
    credentialProcedureService = {
      getCredentialOfferByTransactionCode: jest.fn(),
      getCredentialOfferByCTransactionCode: jest.fn(),
    } as unknown as jest.Mocked<CredentialProcedureService>;

    dialogWrapperService = {
      openErrorInfoDialog: jest.fn(),
    } as unknown as jest.Mocked<DialogWrapperService>;

    breakpointObserver = {
      observe: jest.fn().mockReturnValue(of({ matches: true })),
    } as unknown as jest.Mocked<BreakpointObserver>;

    oidcSecurityService = {
      checkAuth: jest.fn().mockReturnValue(of(mockAuthResponse)),
      authorize: jest.fn(),
      logoff: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    }

    configService = {loadConfigs:() => {}}

    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [BrowserAnimationsModule, RouterModule.forRoot([]), HttpClientModule, CredentialOfferStepperComponent, TranslateModule.forRoot({})],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: routerMock },
        { provide: CredentialProcedureService, useValue: credentialProcedureService },
        { provide: DialogWrapperService, useValue: dialogWrapperService },
        { provide: BreakpointObserver, useValue: breakpointObserver },
        AuthService, TranslateService,
        { provide: OidcSecurityService, useValue: oidcSecurityService },
        { provide: StsConfigLoader, useValue: configService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CredentialOfferStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize stepper orientation to horizontal by default', () => {
  //   expect(component.stepperOrientation$()).toBe('horizontal');
  // });

  // it('should update index when onButtonSelectedStepChange is called', () => {
  //   const spy = jest.spyOn(component.updateIndex$$, 'next');
  //   component.onButtonSelectedStepChange();
  //   expect(spy).toHaveBeenCalledWith(1);
  // });

  // it('should handle label step change correctly', () => {
  //   const spy = jest.spyOn(component.updateIndex$$, 'next');
  //   component.onLabelSelectedStepChange(1);
  //   expect(spy).toHaveBeenCalledWith(1);
  // });

  // it('should call getCredentialOfferByTransactionCode when transaction code is available', () => {
  //   component.offerParams$ = jest.fn().mockReturnValue({ transaction_code: '123', c_transaction_code: undefined });
  //   credentialProcedureService.getCredentialOfferByTransactionCode.mockReturnValue(of({}));

  //   component.getCredentialOffer().subscribe();

  //   expect(credentialProcedureService.getCredentialOfferByTransactionCode).toHaveBeenCalledWith('123');
  // });

  // it('should handle error and call dialog service on getCredentialOfferByTransactionCode failure', () => {
  //   credentialProcedureService.getCredentialOfferByTransactionCode.mockReturnValue(throwError(() => new Error('Test error')));

  //   component.getCredentialOfferByTransactionCode('123').subscribe({
  //     error: () => {
  //       expect(dialogWrapperService.openErrorInfoDialog).toHaveBeenCalledWith(
  //         'The credential offer has expired or already been used.'
  //       );
  //     },
  //   });
  // });

  // it('should update URL parameters correctly', () => {
  //   component.updateUrlParams({ c_transaction_code: 'c123', transaction_code: undefined, credential_offer_uri: undefined, loading: false });
  //   expect(routerMock.navigate).toHaveBeenCalledWith([], { queryParams: { c: 'c123' }, queryParamsHandling: 'merge' });
  // });
});
