import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OidcSecurityService, StsConfigLoader } from "angular-auth-oidc-client";
import { AuthService } from 'src/app/core/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CredentialOfferStepperComponent } from './credential-offer-stepper.component';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));

describe('Credential Offer Stepper', () => {
  let component: CredentialOfferStepperComponent;
  let fixture: ComponentFixture<CredentialOfferStepperComponent>;
  let translateService:TranslateService;
  let procedureService: {
    getCredentialOfferByTransactionCode: jest.Mock,
    getCredentialOfferByCTransactionCode: jest.Mock
  };
  let configService: any

  let oidcSecurityService: {
    checkAuth: jest.Mock,
    authorize: jest.Mock,
    logoff: jest.Mock
  };

  const mockAuthResponse = {
    isAuthenticated: false,
    userData: { emailAddress: 'test@example.com' },
    accessToken: 'dummyAccessToken',
    idToken: 'dummyIdToken'
  };

  beforeEach(async () => {
    configService = { loadConfigs:() => {} };

    oidcSecurityService = {
      checkAuth: jest.fn().mockReturnValue(of(mockAuthResponse)),
      authorize: jest.fn(),
      logoff: jest.fn()
    };
    procedureService = {
        getCredentialOfferByTransactionCode: jest.fn(),
        getCredentialOfferByCTransactionCode: jest.fn()
    }

    await TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [BrowserAnimationsModule, RouterModule.forRoot([]), HttpClientModule, TranslateModule.forRoot({}), CredentialOfferStepperComponent],
    providers: [
        TranslateService,
        AuthService,
        BreakpointObserver,
        { provide: OidcSecurityService, useValue: oidcSecurityService },
        { provide: StsConfigLoader, useValue: configService },
        { provide: CredentialProcedureService, useValue: procedureService }
    ],
}).compileComponents();

    fixture = TestBed.createComponent(CredentialOfferStepperComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);

    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize stepper orientation to horizontal by default', fakeAsync(() => {
    const breakpointObserverMock = TestBed.inject(BreakpointObserver);
    jest.spyOn(breakpointObserverMock, 'observe').mockReturnValue(of({ matches: true } as any));

    fixture = TestBed.createComponent(CredentialOfferStepperComponent);
    component = fixture.componentInstance;

    tick();
    fixture.detectChanges();

    expect(component.stepperOrientation$()).toBe('horizontal');
}));

it('should set stepper orientation to vertical when screen width is less than 800px', fakeAsync(() => {
    const breakpointObserverMock = TestBed.inject(BreakpointObserver);
    jest.spyOn(breakpointObserverMock, 'observe').mockReturnValue(of({ matches: false } as BreakpointState));

    fixture = TestBed.createComponent(CredentialOfferStepperComponent);
    component = fixture.componentInstance;

    tick();
    fixture.detectChanges();

    expect(component.stepperOrientation$()).toBe('vertical');
}));

// it('should update update url params on offer params change', ()=>{
//   const udpateSpy = jest.spyOn(component, 'updateUrlParams');
//   TestBed.flushEffects();
//   expect(udpateSpy).toHaveBeenCalled();
// });

it('should update index and step', ()=>{
  expect(component.currentIndex$()).toBe(0);
  expect(component.currentStep$()).toBe('onboarding');
  component.updateIndex$$.next(1);
  expect(component.currentIndex$()).toBe(1);
  expect(component.currentStep$()).toBe('offer');
});

// it('should update url params', ()=>{
//   const spy = jest.spyOn(component, 'getUrlParams').mockReturnValue('params' as any);
//   component.getUrlParams$$.next();
//   expect(spy).toHaveBeenCalled();
//   component.urlParams$.subscribe(params=>{
//     expect(params).toBe('params');
//   });
// });



});
