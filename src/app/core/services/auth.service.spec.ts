import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

const mockAuthResponse = {
  isAuthenticated: false,
  userData: { emailAddress: 'test@example.com' },
  accessToken: 'dummyAccessToken',
  idToken: 'dummyIdToken'
};

describe('AuthService', () => {
  let service: AuthService;
  let oidcSecurityService: {
    checkAuth: jest.Mock,
    authorize: jest.Mock,
    logoff: jest.Mock
  };

  beforeEach(() => {
    oidcSecurityService = {
      checkAuth: jest.fn().mockReturnValue(of(mockAuthResponse)),
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

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
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
        ...mockAuthResponse,
        isAuthenticated: true,
        accessToken: dummyToken,
        userData: {
          vc: {
            credentialSubject: {
              mandate: {
                power: [{ tmf_function: 'Onboarding', tmf_action: 'Execute' }]
              }
            }
          }
        }
      };
      oidcSecurityService.checkAuth.mockReturnValue(of(authResponse));

      service.handleLoginCallback();

      service.isLoggedIn().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeTruthy();

        service.getToken().subscribe(token => {
          expect(token).toEqual(dummyToken);
          expect(service.getUserPowers()).toContainEqual({ tmf_function: 'Onboarding', tmf_action: 'Execute' });
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

  it('should handle login callback, update subjects accordingly, and check for onboarding power', done => {
    const authResponse = {
      ...mockAuthResponse,
      isAuthenticated: true,
      userData: {
        vc: {
          credentialSubject: {
            mandate: {
              power: [
                { tmf_function: 'Onboarding',tmf_action: 'Execute' }
              ]
            }
          }
        },
        organizationIdentifier: 'Org123',
        organization: 'Test Organization',
        commonName: 'Test User',
        emailAddress: 'testuser@example.com',
        serialNumber: '123456',
        country: 'Testland'
      },
      accessToken: 'mockAccessToken'
    };

    oidcSecurityService.checkAuth.mockReturnValue(of(authResponse));

    service.handleLoginCallback();

    service.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTruthy(); // Debe estar autenticado
      service.getUserData().subscribe(userData => {
        expect(userData).toEqual(authResponse.userData); // Los datos del usuario deben coincidir
        service.getToken().subscribe(token => {
          expect(token).toEqual(authResponse.accessToken); // El token debe coincidir
          // Verifica que los poderes del usuario se han almacenado correctamente
          expect(service.getUserPowers()).toContainEqual({ tmf_function: 'Onboarding',tmf_action: 'Execute' });
          done();
        });
      });
    });
  });


  it('should log a message if authentication fails or is not completed', done => {
    jest.spyOn(console, 'log');
    const authResponse = {
      ...mockAuthResponse,
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
