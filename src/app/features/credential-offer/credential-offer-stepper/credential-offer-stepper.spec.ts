import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OidcSecurityService, StsConfigLoader } from "angular-auth-oidc-client";
import { AuthService } from 'src/app/core/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CredentialOfferStepperComponent, undefinedCredentialOfferParamsState } from './credential-offer-stepper.component';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));


describe('Credential Offer Stepper', () => {
  let component: CredentialOfferStepperComponent;
  let fixture: ComponentFixture<CredentialOfferStepperComponent>;
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
      AuthService,
      BreakpointObserver,
      // { provide: TranslateService, useValue: translate },
      TranslateService,
      { provide: OidcSecurityService, useValue: oidcSecurityService },
      { provide: StsConfigLoader, useValue: configService },
      { provide: CredentialProcedureService, useValue: procedureService }
    ],
}).compileComponents();

    fixture = TestBed.createComponent(CredentialOfferStepperComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); 
  });

  it('should create actions', () => {
    expect(component.getInitUrlParams$$).toBeDefined();
    expect(component.updateIndex$$).toBeDefined();
    expect(component.loadCredentialOfferOnRefreshClick$$).toBeDefined();
  });

  it('effect should update url params when offer params change', () => {
    const updateSpy = jest.spyOn(component, 'updateUrlParams');
    component.getInitUrlParams$$.next();
    TestBed.flushEffects();
    expect(updateSpy).toHaveBeenCalled();
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

it('should update index and step', ()=>{
  expect(component.currentIndex$()).toBe(0);
  expect(component.currentStep$()).toBe('onboarding');
  component.updateIndex$$.next(1);
  expect(component.currentIndex$()).toBe(1);
  expect(component.currentStep$()).toBe('offer');
});

it('should initialize initUrlParams$ correctly', fakeAsync(() => {
  const offerParams = {
    credential_offer_uri: 'cred-offer-uri',
    transaction_code: 'transaction-code-param',
    c_transaction_code: 'c-code-param',
    c_transaction_code_expires_in: 10,
    loading: false,
    error: false
  };
  jest.spyOn(component, 'getUrlParams').mockReturnValue(offerParams);
  
  component.initUrlParams$.subscribe(params => {
    expect(params).toEqual(offerParams);
  });
  component['getInitUrlParams$$'].next();
  tick();
}));

it('should fetch credential offer and emit correct values', fakeAsync(() => {
  const mockParams = { credential_offer_uri: 'cred-uri', c_transaction_code: 'c-code' };
 jest.spyOn(component, 'getCredentialOffer').mockReturnValue(of(mockParams));

 component.fetchedCredentialOffer$.subscribe(paramsState => {
  expect(paramsState).toEqual({
    ...mockParams, loading: false
  });
 });
}));

it('should gracefully handle error when fetching credentials', fakeAsync(() => {
 jest.spyOn(component, 'getCredentialOffer').mockReturnValue(throwError (()=>new Error()));

 component.fetchedCredentialOffer$.subscribe(paramsState => {
  expect(paramsState).toEqual({ 
    loading: false
  });
 });
}));

it('should emit the correct offerParams$ state when initUrlParams$ and fetchedCredentialOffer$ emit values', () => {
  const firstInitUrlParamsMock = {
    credential_offer_uri: 'cred-one',
    transaction_code: 'trans-one',
    c_transaction_code: 'c-one',
    c_transaction_code_expires_in: 10,
    loading: false,
    error: false
  }; 
  const secondInitOfferMock = {
    credential_offer_uri: 'cred-two',
    transaction_code: 'trans-two',
    c_transaction_code: 'c-two',
    c_transaction_code_expires_in: 20,
    loading: false,
    error: false
  };

  jest.spyOn(component, 'getUrlParams').mockReturnValue(firstInitUrlParamsMock);
  component.getInitUrlParams$$.next();
  jest.spyOn(component, 'getUrlParams').mockReturnValue(secondInitOfferMock);
  component.getInitUrlParams$$.next();
  const result = component.offerParams$();

  expect(result).toEqual({
    ...undefinedCredentialOfferParamsState,
    ...firstInitUrlParamsMock,
    ...secondInitOfferMock,
  });
});

it('should get url params on init', () => {
  const mockSubscriber = jest.fn();
  component.getInitUrlParams$$.subscribe(mockSubscriber);

  component.ngOnInit();

  expect(mockSubscriber).toHaveBeenCalled();
});

describe('onSelectedStepChange', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should log an error for an unexpected index', () => {
    component.onSelectedStepChange(2); // Invalid index
    expect(consoleErrorSpy).toHaveBeenCalledWith('Unexpected index');
  });

  it('should emit a new index if it changes and is valid', () => {
    const newIndex = 1;
    const updateIndexSpy = jest.spyOn(component.updateIndex$$, 'next');
    
    jest.spyOn(component, 'currentIndex$').mockReturnValue(0);
    component.onSelectedStepChange(newIndex);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(updateIndexSpy).toHaveBeenCalledWith(newIndex);
  });

  it('should not emit a new index if the index is the same', () => {
    const currentIndex = 1;
    const updateIndexSpy = jest.spyOn(component.updateIndex$$, 'next');
    
    jest.spyOn(component, 'currentIndex$').mockReturnValue(currentIndex);
    component.onSelectedStepChange(currentIndex);

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(updateIndexSpy).not.toHaveBeenCalled();
  });
});

  describe('getUrlParams', () => {
    let consoleErrorSpy: jest.SpyInstance;
  
    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
  
    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });
  
    it('should log an error if transaction_code is missing', () => {
      component['route'].snapshot.queryParams = { c: 'someCCode' };
      const result = component.getUrlParams();
  
      expect(consoleErrorSpy).toHaveBeenCalledWith("Client error: Missing transaction code in the URL. Can't get credential offer.");
      expect(result).toEqual({
        credential_offer_uri: undefined,
        transaction_code: undefined,
        c_transaction_code: 'someCCode',
        loading: false,
        error: false
      });
    });
  
    it('should return updated params with transaction_code and c', () => {
      component['route'].snapshot.queryParams = {
        transaction_code: 'transaction123',
        c: 'someCCode'
      };
      const result = component.getUrlParams();
  
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(result).toEqual({
        credential_offer_uri: undefined,
        transaction_code: 'transaction123',
        c_transaction_code: 'someCCode',
        loading: false,
        error: false
      });
    });
  
    it('should return default values for missing c_transaction_code', () => {
      component['route'].snapshot.queryParams = {
        transaction_code: 'transaction123'
      };
      const result = component.getUrlParams();
  
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(result).toEqual({
        credential_offer_uri: undefined,
        transaction_code: 'transaction123',
        c_transaction_code: undefined,
        loading: false,
        error: false
      });
    });
  });


describe('getCredentialOffer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when no transaction_code or c_transaction_code is available', (done) => {
    jest.spyOn(component, 'offerParams$').mockReturnValue(undefinedCredentialOfferParamsState);
    const dialogSpy = jest.spyOn(component['dialog'], 'openErrorInfoDialog');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const message = component['translate'].instant("error.credentialOffer.invalid-url");

    component.getCredentialOffer().subscribe({
      error: (error) => {
        expect(error.message).toBe('No transaction nor c code to fetch credential offer.');
        expect(consoleErrorSpy).toHaveBeenCalledWith("Client error: Transaction code not found. Can't get credential offer");
        expect(dialogSpy).toHaveBeenCalledWith(message);
        done();
      }
    });
  });

  it('should fetch credential offer by c_transaction_code', () => {
    const mockCTransactionCode = 'mockCTransactionCode';
    const mockOffer = {
      credential_offer_uri: undefined,
      transaction_code: 'mock-trans-code',
      c_transaction_code: mockCTransactionCode,
      c_transaction_code_expires_in: 10,
      loading: false,
      error: false
    };
    const mockResponse = {
      credential_offer_uri: 'some uri',
      c_transaction_code: 'someCCode'
    };

    jest.spyOn(component, 'offerParams$').mockReturnValue(mockOffer);
    procedureService.getCredentialOfferByCTransactionCode.mockReturnValue(of(mockResponse));

    component.getCredentialOffer().subscribe((result) => {
      expect(procedureService.getCredentialOfferByCTransactionCode).toHaveBeenCalledWith(mockCTransactionCode);
      expect(result).toEqual(mockResponse);
    });
  });

  it('should fetch credential offer by transaction_code', () => {
    const mockTransactionCode = 'mockTransactionCode';
    const mockOffer = {
      credential_offer_uri: undefined,
      transaction_code: mockTransactionCode,
      c_transaction_code: undefined,
      c_transaction_code_expires_in: 10,
      loading: false,
      error: false
    };
    const mockResponse = {
      credential_offer_uri: 'some uri',
      c_transaction_code: 'someCCode'
    };

    jest.spyOn(component, 'offerParams$').mockReturnValue(mockOffer);
    procedureService.getCredentialOfferByTransactionCode.mockReturnValue(of(mockResponse));

    component.getCredentialOffer().subscribe((result) => {
      expect(procedureService.getCredentialOfferByTransactionCode).toHaveBeenCalledWith(mockTransactionCode);
      expect(result).toEqual(mockResponse);
    });
  });
});

describe('getCredentialOfferByTransactionCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open error dialog and throw an error when transactionCode is missing', (done) => {
    const dialogSpy = jest.spyOn(component['dialog'], 'openErrorInfoDialog');
    const redirectSpy = jest.spyOn(component, 'redirectToHome');
    const message = component['translate'].instant("error.credentialOffer.invalid-url");

    const result$ = component.getCredentialOfferByTransactionCode('');

    result$.subscribe({
      error: (error) => {
        expect(dialogSpy).toHaveBeenCalledWith(message);
        expect(error).toEqual(new Error());
        expect(redirectSpy).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should call the service and return the credential offer when transactionCode is valid', (done) => {
    const mockTransactionCode = 'validTransactionCode';
    const mockResponse = { credential_offer_uri: 'offer uri', c_transaction_code: 'Test c' };

    procedureService.getCredentialOfferByTransactionCode.mockReturnValue(of(mockResponse));

    const result$ = component.getCredentialOfferByTransactionCode(mockTransactionCode);

    result$.subscribe((response) => {
      expect(procedureService.getCredentialOfferByTransactionCode)
        .toHaveBeenCalledWith(mockTransactionCode);
      expect(response).toEqual(mockResponse);
      done();
    });
  });

  it('should open error dialog and rethrow error when the service call fails', (done) => {
    const mockTransactionCode = 'validTransactionCode';
    const mockError = new Error('Service error');

    procedureService.getCredentialOfferByTransactionCode.mockReturnValue(throwError(() => mockError));
    const dialogSpy = jest.spyOn(component['dialog'], 'openErrorInfoDialog');
    const message = component['translate'].instant('error.credentialOffer.unexpected');

    const result$ = component.getCredentialOfferByTransactionCode(mockTransactionCode);

    result$.subscribe({
      error: (error) => {
        expect(dialogSpy).toHaveBeenCalledWith(message);
        expect(error).toEqual(mockError);
        done();
      }
    });
  });

  it('should open error dialog with a specific message for 404 error and rethrow error', (done) => {
    const mockTransactionCode = 'validTransactionCode';
    const mockError = { status: 404, message: 'Not Found' };
    const message = component['translate'].instant("error.credentialOffer.expired");
  
    procedureService.getCredentialOfferByTransactionCode.mockReturnValue(throwError(() => mockError));
    const dialogSpy = jest.spyOn(component['dialog'], 'openErrorInfoDialog');
  
    const result$ = component.getCredentialOfferByTransactionCode(mockTransactionCode);
  
    result$.subscribe({
      error: (error) => {
        expect(dialogSpy).toHaveBeenCalledWith(message);
        expect(error).toEqual(mockError);
        done();
      }
    });
  });


});
describe('getCredentialOfferByCTransactionCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open error dialog and throw an error when cTransactionCode is missing', (done) => {
    const redirectSpy = jest.spyOn(component, 'redirectToHome');
    const dialogSpy = jest.spyOn(component['dialog'], 'openErrorInfoDialog');
    const message = component['translate'].instant("error.credentialOffer.invalid-url");

    const result$ = component.getCredentialOfferByCTransactionCode('');

    result$.subscribe({
      error: (error) => {
        expect(dialogSpy).toHaveBeenCalledWith(message);
        expect(redirectSpy).toHaveBeenCalled();
        expect(error).toEqual(new Error());
        done();
      }
    });
  });

  it('should call the service and return the credential offer when cTransactionCode is valid', (done) => {
    const mockTransactionCode = 'validCTransactionCode';
    const mockResponse = { credential_offer_uri: 'offer uri', c_transaction_code: 'Test c' };

    procedureService.getCredentialOfferByCTransactionCode.mockReturnValue(of(mockResponse));

    const result$ = component.getCredentialOfferByCTransactionCode(mockTransactionCode);

    result$.subscribe((response) => {
      expect(procedureService.getCredentialOfferByCTransactionCode)
        .toHaveBeenCalledWith(mockTransactionCode);
      expect(response).toEqual(mockResponse);
      done();
    });
  });

  it('should open error dialog and rethrow error when the service call by c-code fails', (done) => {
    const mockTransactionCode = 'validTransactionCode';
    const mockError = new Error('Service error');

    procedureService.getCredentialOfferByCTransactionCode.mockReturnValue(throwError(() => mockError));
    const dialogSpy = jest.spyOn(component['dialog'], 'openErrorInfoDialog');
    const message = component['translate'].instant('error.credentialOffer.unexpected');

    const result$ = component.getCredentialOfferByCTransactionCode(mockTransactionCode);

    result$.subscribe({
      error: (error) => {
        expect(dialogSpy).toHaveBeenCalledWith(message);
        expect(error).toEqual(mockError);
        done();
      }
    });
  });

  it('should open error dialog for 404 status', (done) => {
    const mockTransactionCode = 'validTransactionCode';
    const mockError = new HttpErrorResponse({
      error: { message: 'Not Found' },
      status: 404,
      statusText: 'Not Found',
    });
    const message = component['translate'].instant("error.credentialOffer.expired");

    procedureService.getCredentialOfferByCTransactionCode.mockReturnValue(throwError(() => mockError));
    const dialogSpy = jest.spyOn(component['dialog'], 'openErrorInfoDialog');

    const result$ = component.getCredentialOfferByCTransactionCode(mockTransactionCode);

    result$.subscribe({
      error: (error) => {
        expect(dialogSpy).toHaveBeenCalledWith(message);
        expect(error).toEqual(mockError);
        done();
      }
    });
});

it('should open error dialog for 409 status', (done) => {
  const mockTransactionCode = 'validTransactionCode';
  const mockError = new HttpErrorResponse({
    error: { message: 'Not Found' },
    status: 409,
    statusText: 'Not Found',
  });

  procedureService.getCredentialOfferByCTransactionCode.mockReturnValue(throwError(() => mockError));
  const dialogSpy = jest.spyOn(component['dialog'], 'openErrorInfoDialog');

  const result$ = component.getCredentialOfferByCTransactionCode(mockTransactionCode);

  result$.subscribe({
    error: (error) => {
      expect(dialogSpy).toHaveBeenCalledWith('The credential has already been obtained.');
      expect(error).toEqual(mockError);
      done();
    }
  });
});
});

it('should not navigate when c_transaction_code is not provided', () => {
  const mockParams = { c_transaction_code: null } as any;
  const navigateSpy = jest.spyOn(component['router'], 'navigate');

  component.updateUrlParams(mockParams);

  expect(navigateSpy).not.toHaveBeenCalled();
});

it('should navigate when c_transaction_code is provided', () => {
  const mockParams = { c_transaction_code: 'valid-code' } as any;
  const navigateSpy = jest.spyOn(component['router'], 'navigate');

  component.updateUrlParams(mockParams);

  expect(navigateSpy).toHaveBeenCalled();
});

  it('should call next on loadCredentialOfferOnRefreshClick$$ when onRefreshCredentialClick is called', () => {
    const nextSpy = jest.spyOn(component.loadCredentialOfferOnRefreshClick$$, 'next');

    component.onRefreshCredentialClick();
  
    expect(nextSpy).toHaveBeenCalled();
  });
  
  it('should navigate to "/home" when redirectToHome is called', () => {
    const routerSpy = jest.spyOn(component['router'],'navigate');
    component.redirectToHome();
  
    setTimeout(()=>{
      expect(routerSpy).toHaveBeenCalledWith(['/home']);
    }, 1000);
  });
  

});
