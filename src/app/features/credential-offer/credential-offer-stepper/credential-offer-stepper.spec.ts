import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OidcSecurityService, StsConfigLoader } from "angular-auth-oidc-client";
import { AuthService } from 'src/app/core/services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CredentialOfferParamsState, CredentialOfferStepperComponent, undefinedCredentialOfferParamsState } from './credential-offer-stepper.component';
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

// it('should fetch credential offer and emit correct values', fakeAsync(() => {
//   // Mock the response of getCredentialOffer
//   const mockCredentialOffer = { credential_offer_uri: '123', transaction_code: 'trans-code' };
//   const mockError = new Error('Failed to fetch credential offer');
  
//   // Mock getCredentialOffer to return a success response
//   jest.spyOn(component, 'getCredentialOffer').mockReturnValue(of(mockCredentialOffer));

//   const emittedValues: Partial<CredentialOfferParamsState>[] = [];
  
//   // Subscribe to fetchedCredentialOffer$ to capture emitted values
//   const subscription = component.fetchedCredentialOffer$.subscribe(value => emittedValues.push(value));

//   // Simulate index change to 1 to trigger the observable
//   component.updateIndex$$.next(1);
//   tick(); // Simulate passage of time

//   // Verify the emitted values
//   expect(emittedValues).toEqual([
//       { loading: true }, // Initial loading state
//       { ...mockCredentialOffer, loading: false } // Loaded state with offer data
//   ]);

//   // Mock getCredentialOffer to return an error
//   jest.spyOn(component, 'getCredentialOffer').mockReturnValue(throwError(() => mockError));

//   // Clear emitted values and re-trigger the observable
//   emittedValues.length = 0;
//   component.updateIndex$$.next(1);
//   tick();

//   // Verify the error handling in emitted values
//   expect(emittedValues).toEqual([{ loading: false }]);

//   subscription.unsubscribe(); // Cleanup
// }));


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

  describe('getUrlParams', () => {
    let consoleErrorSpy: jest.SpyInstance;
  
    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });
  
    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });
  
    it('should log an error if transaction_code is missing', () => {
      const params = { c: 'someCCode' }; // Missing transaction_code
  
      const result = component.getUrlParams(params);
  
      expect(consoleErrorSpy).toHaveBeenCalledWith("Transaction code not found. Can't get credential offer");
      expect(result).toEqual({
        credential_offer_uri: undefined,
        transaction_code: undefined,
        c_transaction_code: 'someCCode',
        loading: false
      });
    });
  
    it('should return updated params with transaction_code and c', () => {
      const params = {
        transaction_code: 'transaction123',
        c: 'someCCode'
      };
  
      const result = component.getUrlParams(params);
  
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(result).toEqual({
        credential_offer_uri: undefined,
        transaction_code: 'transaction123',
        c_transaction_code: 'someCCode',
        loading: false
      });
    });
  
    it('should return default values for missing c_transaction_code', () => {
      const params = {
        transaction_code: 'transaction123'
      };
  
      const result = component.getUrlParams(params);
  
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(result).toEqual({
        credential_offer_uri: undefined,
        transaction_code: 'transaction123',
        c_transaction_code: undefined,
        loading: false
      });
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
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    component.getCredentialOffer().subscribe({
      error: (error) => {
        expect(error.message).toBe('No transaction nor c code to fetch credential offer.');
        expect(consoleLogSpy).toHaveBeenCalledWith("Client error: Transaction code not found. Can't get credential offer");
        expect(dialogSpy).toHaveBeenCalledWith("Transaction code not found. Can't get credential offer");
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
      loading: false
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
      loading: false
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
    const result$ = component.getCredentialOfferByTransactionCode('');

    result$.subscribe({
      error: (error) => {
        expect(dialogSpy).toHaveBeenCalledWith("No transaction code was found in the URL, can't refresh QR.");
        expect(error).toEqual(new Error());
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

    const result$ = component.getCredentialOfferByTransactionCode(mockTransactionCode);

    result$.subscribe({
      error: (error) => {
        expect(dialogSpy).toHaveBeenCalledWith('The credential offer has expired or already been used.');
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
    const dialogSpy = jest.spyOn(component['dialog'], 'openErrorInfoDialog');
    const result$ = component.getCredentialOfferByCTransactionCode('');

    result$.subscribe({
      error: (error) => {
        expect(dialogSpy).toHaveBeenCalledWith("No c-transaction code was found, can't refresh QR.");
        expect(error).toEqual(new Error());
        done();
      }
    });
  });

  // it('should call the service and return the credential offer when cTransactionCode is valid', (done) => {
  //   const mockTransactionCode = 'validCTransactionCode';
  //   const mockResponse = { credential_offer_uri: 'offer uri', c_transaction_code: 'Test c' };

  //   procedureService.getCredentialOfferByCTransactionCode.mockReturnValue(of(mockResponse));

  //   const result$ = component.getCredentialOfferByTransactionCode(mockTransactionCode);

  //   result$.subscribe((response) => {
  //     expect(procedureService.getCredentialOfferByCTransactionCode)
  //       .toHaveBeenCalledWith(mockTransactionCode);
  //     expect(response).toEqual(mockResponse);
  //     done();
  //   });
  // });

  // it('should open error dialog and rethrow error when the service call fails', (done) => {
  //   const mockTransactionCode = 'validTransactionCode';
  //   const mockError = new Error('Service error');

  //   procedureService.getCredentialOfferByCTransactionCode.mockReturnValue(throwError(() => mockError));
  //   const dialogSpy = jest.spyOn(component['dialog'], 'openErrorInfoDialog');

  //   const result$ = component.getCredentialOfferByCTransactionCode(mockTransactionCode);

  //   result$.subscribe({
  //     error: (error) => {
  //       expect(dialogSpy).toHaveBeenCalledWith('The credential offer has expired or already been used.');
  //       expect(error).toEqual(mockError);
  //       done();
  //     }
  //   });
  // });

});

});
