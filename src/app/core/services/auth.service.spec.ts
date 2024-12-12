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

  it('should call logoff and clear localStorage when logout is called', () => {
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

  it('should return true if user has "Onboarding" power with action array containing "Execute"', () => {
    (service as any).userPowers = [
      { tmf_function: 'Onboarding', tmf_action: ['Read', 'Execute', 'Write'] }
    ];

    const result = service.hasOnboardingExecutePower();
    expect(result).toBeTruthy();
  });

  it('should return false if user has "Onboarding" power but no "Execute" action', () => {
    (service as any).userPowers = [
      { tmf_function: 'Onboarding', tmf_action: ['Read', 'Write'] }
    ];

    const result = service.hasOnboardingExecutePower();
    expect(result).toBeFalsy();
  });

  it('should return false if user has no "Onboarding" power', () => {
    (service as any).userPowers = [
      { tmf_function: 'OtherFunction', tmf_action: 'Execute' }
    ];

    const result = service.hasOnboardingExecutePower();
    expect(result).toBeFalsy();
  });

  it('should return false if userPowers is empty', () => {
    (service as any).userPowers = [];

    const result = service.hasOnboardingExecutePower();
    expect(result).toBeFalsy();
  });

  it('should return true if userData.organizationIdentifier matches "VATES-B60645900"', () => {
    const mockUserData = { organizationIdentifier: 'VATES-B60645900' };
    (service as any).userDataSubject.next(mockUserData);

    const result = service.hasIn2OrganizationIdentifier();
    expect(result).toBeTruthy();
  });

  it('should return false if userData.organizationIdentifier does not match "VATES-B60645900"', () => {
    const mockUserData = { organizationIdentifier: 'OTHER-ORG123' };
    (service as any).userDataSubject.next(mockUserData);

    const result = service.hasIn2OrganizationIdentifier();
    expect(result).toBeFalsy();
  });

  it('should return false if userData is null', () => {
    const mockUserData = { organizationIdentifier: null };
    (service as any).userDataSubject.next(mockUserData);

    const result = service.hasIn2OrganizationIdentifier();
    expect(result).toBeFalsy();
  });

  it('should return false if userData.organizationIdentifier is undefined', () => {
    const mockUserData = { otherField: 'someValue' };
    (service as any).userDataSubject.next(mockUserData);

    const result = service.hasIn2OrganizationIdentifier();
    expect(result).toBeFalsy();
  });

  it('should return the mandatorSubject as an observable', done => {
    const mockMandator = {
      organizationIdentifier: 'ORG123',
      organization: 'Test Organization',
      commonName: 'Test Common Name',
      emailAddress: 'test@example.com',
      serialNumber: '123456',
      country: 'Testland'
    };

    (service as any).mandatorSubject.next(mockMandator);

    service.getMandator().subscribe(mandator => {
      expect(mandator).toEqual(mockMandator);
      done();
    });
  });

  it('should return null if no mandator is set', done => {
    (service as any).mandatorSubject.next(null);

    service.getMandator().subscribe(mandator => {
      expect(mandator).toBeNull();
      done();
    });
  });

  it('should return the signerSubject as an observable', done => {
    const mockSigner = {
      organizationIdentifier: 'SIGNER123',
      organization: 'Signer Organization',
      commonName: 'Signer Common Name',
      emailAddress: 'signer@example.com',
      serialNumber: '7891011',
      country: 'Signerland'
    };

    (service as any).signerSubject.next(mockSigner);

    service.getSigner().subscribe(signer => {
      expect(signer).toEqual(mockSigner);
      done();
    });
  });

  it('should return null if no signer is set', done => {
    (service as any).signerSubject.next(null);

    service.getSigner().subscribe(signer => {
      expect(signer).toBeNull();
      done();
    });
  });

  it('should return the nameSubject as an observable', done => {
    const mockName = 'John Doe';

    (service as any).nameSubject.next(mockName);

    service.getName().subscribe(name => {
      expect(name).toEqual(mockName);
      done();
    });
  });

  it('should return an empty string if no name is set', done => {
    (service as any).nameSubject.next('');

    service.getName().subscribe(name => {
      expect(name).toBe('');
      done();
    });
  });

  it('should set isAuthenticated, userData, and token if the user is authenticated and has onboarding execute power', done => {
    const mockUserData = {
      vc: JSON.stringify({
        credentialSubject: {
          mandate: {
            power: [{ tmf_function: 'Onboarding', tmf_action: 'Execute' }]
          }
        }
      })
    };

    const mockAuthResponse = {
      isAuthenticated: true,
      userData: mockUserData,
      accessToken: 'dummyAccessToken'
    };

    oidcSecurityService.checkAuth.mockReturnValue(of(mockAuthResponse));

    service.handleLoginCallback();

    service.isLoggedIn().subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeTruthy()

      service.getUserData().subscribe(userData => {
        expect(userData).toEqual(mockUserData);

        service.getToken().subscribe(token => {
          expect(token).toEqual('dummyAccessToken');
          done();
        });
      });
    });
  });

  it('should call logout if the user is authenticated but does not have onboarding execute power', () => {
    const mockUserData = {
      vc: JSON.stringify({
        credentialSubject: {
          mandate: {
            power: [{ tmf_function: 'OtherFunction', tmf_action: 'Read' }]
          }
        }
      })
    };

    const mockAuthResponse = {
      isAuthenticated: true,
      userData: mockUserData,
      accessToken: 'dummyAccessToken'
    };

    oidcSecurityService.checkAuth.mockReturnValue(of(mockAuthResponse));

    jest.spyOn(service, 'logout');

    service.handleLoginCallback();

    expect(service.logout).toHaveBeenCalled();
  });

  it('should not set any subjects if the user is not authenticated', done => {
    const mockAuthResponse = {
      isAuthenticated: false,
      userData: null,
      accessToken: null
    };

    oidcSecurityService.checkAuth.mockReturnValue(of(mockAuthResponse));

    service.handleLoginCallback();

    service.isLoggedIn().subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeFalsy();

      service.getUserData().subscribe(userData => {
        expect(userData).toBeNull();

        service.getToken().subscribe(token => {
          expect(token).toBe('');
          done();
        });
      });
    });
  });

  it('should set isAuthenticated, userData, mandator, signer, email and name when the user is authenticated', done => {
    const mockUserData = {
      vc: JSON.stringify({
        credentialSubject: {
          mandate: {
            mandator: {
              organizationIdentifier: 'ORG123',
              organization: 'Test Organization',
              commonName: 'Mandator Name',
              emailAddress: 'mandator@example.com',
              serialNumber: '123456',
              country: 'Testland'
            },
            signer: {
              organizationIdentifier: 'VATEU-B99999999',
              organization: 'OLIMPO',
              commonName: 'ZEUS OLIMPOS',
              emailAddress: 'domesupport@in2.es',
              serialNumber: 'IDCEU-99999999P',
              country: 'EU'
            },
            mandatee: {
              first_name: 'John',
              last_name: 'Doe'
            },
            power: [{ tmf_function: 'Onboarding', tmf_action: 'Execute' }]
          }
        }
      })
    };

    const mockAuthResponse = {
      isAuthenticated: true,
      userData: mockUserData,
      accessToken: 'dummyAccessToken'
    };

    oidcSecurityService.checkAuth.mockReturnValue(of(mockAuthResponse));

    service.checkAuth().subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeTruthy();

      service.isLoggedIn().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeTruthy();

        service.getUserData().subscribe(userData => {
          expect(userData).toEqual(mockUserData);

          service.getToken().subscribe(token => {
            expect(token).toEqual('');

            service.getMandator().subscribe(mandator => {
              expect(mandator).toEqual({
                organizationIdentifier: 'ORG123',
                organization: 'Test Organization',
                commonName: 'Mandator Name',
                emailAddress: 'mandator@example.com',
                serialNumber: '123456',
                country: 'Testland'
              });

              service.getSigner().subscribe(signer => {
                expect(signer).toEqual({
                  organizationIdentifier: 'VATEU-B99999999',
                  organization: 'OLIMPO',
                  commonName: 'ZEUS OLIMPOS',
                  emailAddress: 'domesupport@in2.es',
                  serialNumber: 'IDCEU-99999999P',
                  country: 'EU'
                });

                service.getEmailName().subscribe(emailName => {
                  expect(emailName).toBe('mandator');

                  service.getName().subscribe(name => {
                    expect(name).toBe('John Doe');
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it('should return false if the user is not authenticated', done => {
    const mockAuthResponse = {
      isAuthenticated: false,
      userData: null,
      accessToken: ''
    };

    oidcSecurityService.checkAuth.mockReturnValue(of(mockAuthResponse));

    service.checkAuth().subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeFalsy();

      service.isLoggedIn().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeFalsy();

        service.getUserData().subscribe(userData => {
          expect(userData).toBeNull();

          service.getToken().subscribe(token => {
            expect(token).toBe('');
            done();
          });
        });
      });
    });
  });
});
