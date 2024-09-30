import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let oidcSecurityService: {
    checkAuth: jest.Mock,
    authorize: jest.Mock,
    logoff: jest.Mock
  };

  beforeEach(() => {
    oidcSecurityService = {
      checkAuth: jest.fn().mockReturnValue(of({
        isAuthenticated: false,
        userData: null,
        accessToken: '',
        idToken: ''
      })),
      authorize: jest.fn(),
      logoff: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: OidcSecurityService, useValue: oidcSecurityService }
      ]
    });
    
    service = TestBed.inject(AuthService);
    Object.defineProperty(window, 'localStorage', {
      value: {
        clear: jest.fn()
      },
      writable: true
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should call authorize on OidcSecurityService when login is called', () => {
    service.login();
    expect(oidcSecurityService.authorize).toHaveBeenCalled();
  });
  
    // TODO this test needs to be fixed
    // The error occurs because there is a timeout issue. This can happen if the asynchronous
    // code does not complete within the set timeout interval. Ensure that all observables
    // and asynchronous calls are properly handled and that the test completes within the timeout.
  
    // it('should set isAuthenticatedSubject based on OidcSecurityService checkAuth response', done => {
    //   const authResponse = {
    //     isAuthenticated: true,
    //     userData: { emailAddress: 'test@example.com' },
    //     accessToken: 'dummyAccessToken',
    //     idToken: 'dummyIdToken'
    //   };
    //   oidcSecurityService.checkAuth.and.returnValue(of(authResponse));
    //
    //   service.checkAuth().subscribe(isAuthenticated => {
    //     expect(isAuthenticated).toBeTrue();
    //     service.isLoggedIn().subscribe(isLoggedIn => {
    //       expect(isLoggedIn).toBeTrue();
    //       done();
    //     });
    //   });
    // });

  it('should clear localStorage and call logoff on OidcSecurityService when logout is called', () => {
    service.logout();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(oidcSecurityService.logoff).toHaveBeenCalled();
  });

  it('should return isAuthenticatedSubject as observable when isLoggedIn is called', done => {
    service.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeFalsy();
      done();
    });
  });

  it('should handle login callback and update subjects accordingly', done => {
    const authResponse = {
      isAuthenticated: true,
      userData: { emailAddress: 'john.doe@example.com' },
      accessToken: 'dummyAccessToken',
      idToken: 'dummyIdToken'
    };
    oidcSecurityService.checkAuth.mockReturnValue(of(authResponse));

    service.handleLoginCallback();
    service.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTruthy();
      service.getUserData().subscribe(userData => {
        expect(userData).toEqual(authResponse.userData);
        service.getToken().subscribe(token => {
          expect(token).toEqual(authResponse.accessToken);
          service.getEmailName().subscribe(emailName => {
            expect(emailName).toEqual('');
            done();
          });
        });
      });
    });
  });

  it('should log a message if authentication fails or is not completed', done => {
    jest.spyOn(console, 'log');
    const authResponse = {
      isAuthenticated: false,
      userData: null,
      accessToken: '',
      idToken: ''
    };
    oidcSecurityService.checkAuth(of(authResponse));

    service.handleLoginCallback();
    service.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeFalsy();
      expect(console.log).toHaveBeenCalledWith('Authentication failed or not completed yet.');
      done();
    });
  });

  it('should return user data as observable when getUserData is called', done => {
    service.getUserData().subscribe(userData => {
      expect(userData).toBeNull();
      done();
    });
  });

  it('should return email name as observable when getEmailName is called', done => {
    service.getEmailName().subscribe(emailName => {
      expect(emailName).toBe('');
      done();
    });
  });

  it('should return token as observable when getToken is called', done => {
    service.getToken().subscribe(token => {
      expect(token).toBe('');
      done();
    });
  });
});
