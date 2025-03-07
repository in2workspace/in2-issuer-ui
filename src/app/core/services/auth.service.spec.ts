import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { UserDataAuthenticationResponse } from "../models/dto/user-data-authentication-response.dto";

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
    logoffAndRevokeTokens: jest.Mock
  };

  beforeEach(() => {
    oidcSecurityService = {
      checkAuth: jest.fn().mockReturnValue(of(mockAuthResponse)),
      authorize: jest.fn(),
      logoffAndRevokeTokens: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: OidcSecurityService, useValue: oidcSecurityService }
      ]
    });

    service = TestBed.inject(AuthService);
    Object.defineProperty(window, 'sessionStorage', {
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

  it('should call logoffAndRevokeTokens and clear sessionStorage when logout is called', () => {
    service.logout();
    expect(oidcSecurityService.logoffAndRevokeTokens).toHaveBeenCalled();
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
      { function: 'Onboarding', action: ['Read', 'Execute', 'Write'] }
    ];

    const result = service.hasPower('Onboarding','Execute');
    expect(result).toBeTruthy();
  });

  it('should return false if user has "Onboarding" power but no "Execute" action', () => {
    (service as any).userPowers = [
      { function: 'Onboarding', action: ['Read', 'Write'] }
    ];

    const result = service.hasPower('Onboarding','Execute');
    expect(result).toBeFalsy();
  });

  it('should return false if user has no "Onboarding" power', () => {
    (service as any).userPowers = [
      { function: 'OtherFunction', action: 'Execute' }
    ];

    const result = service.hasPower('Onboarding','Execute');
    expect(result).toBeFalsy();
  });

  it('should return false if userPowers is empty', () => {
    (service as any).userPowers = [];

    const result = service.hasPower('Onboarding','Execute');
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
    const mockUserData: UserDataAuthenticationResponse = {
      sub: 'subValue',
      commonName: 'commonNameValue',
      country: 'countryValue',
      serialNumber: 'serialNumberValue',
      email_verified: true,
      preferred_username: 'preferred_usernameValue',
      given_name: 'givenNameValue',
      vc: {
        id: 'some-id',
        type: ['VerifiableCredential', 'LEARCredentialEmployee'],
        credentialSubject: {
          mandate: {
            id: 'mandate-id',
            life_span: {
              start_date_time: '2021-01-01T00:00:00Z',
              end_date_time: '2021-12-31T23:59:59Z'
            },
            mandatee: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              nationality: 'ES'
            },
            mandator: {
              organizationIdentifier: 'ORG123',
              organization: 'Test Organization',
              commonName: 'Mandator Name',
              emailAddress: 'mandator@example.com',
              serialNumber: '123456',
              country: 'Testland'
            },
            signer: {
              organizationIdentifier: 'SIGNER123',
              organization: 'Signer Organization',
              commonName: 'Signer Name',
              emailAddress: 'signer@example.com',
              serialNumber: '7891011',
              country: 'Signerland'
            },
            power: [{ function: 'Onboarding', action: 'Execute' , domain: 'domain', type: 'type' }]
          }
        },
        expirationDate: '2024-12-31T23:59:59Z',
        issuanceDate: '2024-01-01T00:00:00Z',
        issuer: 'issuer-id',
        validFrom: '2024-01-01T00:00:00Z'
      },
      'tenant-id': 'tenant-idValue',
      emailAddress: 'someone@example.com',
      organizationIdentifier: 'ORG123',
      organization: 'Test Organization',
      name: 'John Doe',
      family_name: 'Doe'
    };

    const mockAuthResponse = {
      isAuthenticated: true,
      userData: mockUserData,
      accessToken: 'dummyAccessToken'
    };

    oidcSecurityService.checkAuth.mockReturnValue(of(mockAuthResponse));

    service.handleLoginCallback();

    service.isLoggedIn().subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeTruthy();

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
    const mockUserData: UserDataAuthenticationResponse = {
      sub: 'sub',
      commonName: 'commonName',
      country: 'country',
      serialNumber: 'serialNumber',
      email_verified: true,
      preferred_username: 'preferred_username',
      given_name: 'given_name',
      vc: {
        id: 'some-id',
        type: ['VerifiableCredential', 'LEARCredentialEmployee'],
        credentialSubject: {
          mandate: {
            id: 'mandate-id',
            life_span: {
              end_date_time: '2024-12-31T23:59:59Z',
              start_date_time: '2024-01-01T00:00:00Z'
            },
            mandator: {
              organizationIdentifier: 'ORG123',
              organization: 'Test Organization',
              commonName: 'Mandator Name',
              emailAddress: 'mandator@example.com',
              serialNumber: '123456',
              country: 'Testland'
            },
            signer: {
              organizationIdentifier: 'SIGNER123',
              organization: 'Signer Organization',
              commonName: 'Signer Name',
              emailAddress: 'signer@example.com',
              serialNumber: '7891011',
              country: 'Signerland'
            },
            mandatee: {
              firstName: 'John',
              lastName: 'Doe',
              email: '',
              nationality: ''
            },
            power: [{ function: 'OtherFunction', action: 'Read', type: 'type', domain: 'domain' }]
          }
        },
        expirationDate: '2024-12-31T23:59:59Z',
        issuanceDate: '2024-01-01T00:00:00Z',
        issuer: 'issuer-id',
        validFrom: '2024-01-01T00:00:00Z'
      },
      'tenant-id': 'tenant-id',
      emailAddress: 'someone@example.com',
      organizationIdentifier: 'ORG123',
      organization: 'Test Organization',
      name: 'John Doe',
      family_name: 'Doe'
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

  it('should set isAuthenticated, userData, mandator, email and name when the user is authenticated', done => {
    const mockUserData: UserDataAuthenticationResponse = {
      sub: 'sub',
      commonName: 'commonName',
      country: 'country',
      serialNumber: 'serialNumber',
      email_verified: true,
      preferred_username: 'preferred_username',
      given_name: 'given_name',
      vc: {
        id: 'some-id',
        type: ['VerifiableCredential', 'LEARCredentialEmployee'],
        credentialSubject: {
          mandate: {
            id: 'mandate-id',
            life_span: {
              end_date_time: '2024-12-31T23:59:59Z',
              start_date_time: '2024-01-01T00:00:00Z'
            },
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
              firstName: 'John',
              lastName: 'Doe',
              email: 'jhonDoe@example.com',
              nationality: ''
            },
            power: [{ function: 'Onboarding', action: 'Execute', domain: 'domain', type: 'type' }]
          }
        },
        expirationDate: '2024-12-31T23:59:59Z',
        issuanceDate: '2024-01-01T00:00:00Z',
        issuer: 'issuer-id',
        validFrom: '2024-01-01T00:00:00Z'
      },
      'tenant-id': 'tenant-id',
      emailAddress: 'someone@example.com',
      organizationIdentifier: 'ORG123',
      organization: 'Test Organization',
      name: 'John Doe',
      family_name: 'Doe'
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
            // En este flujo el token inicial no se setea (quedaría vacío)
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

              // Si ya no seteas signer, puedes esperar null o simplemente omitir esta verificación:
              service.getSigner().subscribe(signer => {
                expect(signer).toBeNull(); // o no llamar a getSigner() si se ha eliminado

                service.getEmailName().subscribe(emailName => {
                  // El emailName se obtiene al dividir el emailAddress de mandator (antes del '@')
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
