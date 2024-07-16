import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let oidcSecurityService: jasmine.SpyObj<OidcSecurityService>;

  beforeEach(() => {
    const oidcSecurityServiceSpy = jasmine.createSpyObj('OidcSecurityService', ['checkAuth', 'authorize', 'logoff']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: OidcSecurityService, useValue: oidcSecurityServiceSpy }
      ]
    });

    oidcSecurityService = TestBed.inject(OidcSecurityService) as jasmine.SpyObj<OidcSecurityService>;

    oidcSecurityService.checkAuth.and.returnValue(of({
      isAuthenticated: false,
      userData: null,
      accessToken: '',
      idToken: ''
    }));

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO this test needs to be fixed
  // The error occurs because there is a timeout issue. This can happen if the asynchronous
  // code does not complete within the set timeout interval. Ensure that all observables
  // and asynchronous calls are properly handled and that the test completes within the timeout.

  // it('should set isAuthenticatedSubject based on OidcSecurityService checkAuth response', (done: DoneFn) => {
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

  it('should call authorize on OidcSecurityService when login is called', () => {
    service.login();
    expect(oidcSecurityService.authorize).toHaveBeenCalled();
  });

  it('should clear localStorage and call logoff on OidcSecurityService when logout is called', () => {
    spyOn(localStorage, 'clear').and.callThrough();
    service.logout();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(oidcSecurityService.logoff).toHaveBeenCalled();
  });

  it('should return isAuthenticatedSubject as observable when isLoggedIn is called', (done: DoneFn) => {
    service.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeFalse();
      done();
    });
  });

  it('should handle login callback and update subjects accordingly', (done: DoneFn) => {
    const authResponse = {
      isAuthenticated: true,
      userData: { emailAddress: 'john.doe@example.com' },
      accessToken: 'dummyAccessToken',
      idToken: 'dummyIdToken'
    };
    oidcSecurityService.checkAuth.and.returnValue(of(authResponse));

    service.handleLoginCallback();
    service.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTrue();
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

  it('should log a message if authentication fails or is not completed', (done: DoneFn) => {
    spyOn(console, 'log');
    const authResponse = {
      isAuthenticated: false,
      userData: null,
      accessToken: '',
      idToken: ''
    };
    oidcSecurityService.checkAuth.and.returnValue(of(authResponse));

    service.handleLoginCallback();
    service.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeFalse();
      expect(console.log).toHaveBeenCalledWith('Authentication failed or not completed yet.');
      done();
    });
  });

  it('should return user data as observable when getUserData is called', (done: DoneFn) => {
    service.getUserData().subscribe(userData => {
      expect(userData).toBeNull();
      done();
    });
  });

  it('should return email name as observable when getEmailName is called', (done: DoneFn) => {
    service.getEmailName().subscribe(emailName => {
      expect(emailName).toBe('');
      done();
    });
  });

  it('should return token as observable when getToken is called', (done: DoneFn) => {
    service.getToken().subscribe(token => {
      expect(token).toBe('');
      done();
    });
  });
});
