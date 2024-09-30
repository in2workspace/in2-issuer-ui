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
  
    it('should set isAuthenticatedSubject based on OidcSecurityService checkAuth response', done => {
      const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQtY29uc29sZSI6eyJyb2xlcyI6WyJhZG1pbiJdfX0sImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const authResponse = {
        isAuthenticated: true,
        userData: { emailAddress: 'test@example.com' },
        accessToken: dummyToken,
        idToken: 'dummyIdToken'
      };
      oidcSecurityService.checkAuth.mockReturnValue(of(authResponse));
    
      service.checkAuth().subscribe(isAuthenticated => {
        expect(isAuthenticated).toBeTruthy();
        service.isLoggedIn().subscribe(isLoggedIn => {
          expect(isLoggedIn).toBeTruthy();
          done();
        });
      });
    });

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
