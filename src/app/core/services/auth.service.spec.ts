import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserDataAuthenticationResponse } from '../models/dto/user-data-authentication-response.dto';
import { LEARCredentialEmployeeDataNormalizer } from '../models/entity/lear-credential-employee-data-normalizer';
import { LEARCredentialEmployee } from '../models/entity/lear-credential-employee.entity';
import { RoleType } from '../models/enums/auth-rol-type.enum';

/**
 * A few mock objects to reduce repetition.
 * Adjust as needed for your real data shape.
 */
const mockCredentialEmployee: LEARCredentialEmployee = {
  id: 'some-id',
  type: ['VerifiableCredential', 'LEARCredentialEmployee'],
  credentialSubject: {
    mandate: {
      id: 'mandate-id',
      life_span: {
        start_date_time: '2024-01-01T00:00:00Z',
        end_date_time: '2024-12-31T23:59:59Z'
      },
      signer: {
        organizationIdentifier: 'SIGNER123',
        organization: 'Signer Organization',
        commonName: 'Signer Name',
        emailAddress: 'signer@example.com',
        serialNumber: '7891011',
        country: 'Signerland'
      },
      mandator: {
        organizationIdentifier: 'ORG123',
        organization: 'Test Organization',
        commonName: 'Mandator Name',
        emailAddress: 'mandator@example.com',
        serialNumber: '123456',
        country: 'Testland'
      },
      mandatee: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'jhonDoe@example.com',
        nationality: ''
      },
      power: [
        {
          function: 'Onboarding',
          action: 'Execute',
          domain: 'domain',
          type: 'type'
        }
      ]
    }
  },
  expirationDate: '2024-12-31T23:59:59Z',
  issuanceDate: '2024-01-01T00:00:00Z',
  issuer: {
    organizationIdentifier: 'ORG123',
    organization: 'Test Organization',
    commonName: 'Mandator Name',
    emailAddress: 'mandator@example.com',
    serialNumber: '123456',
    country: 'Testland'
  },
  validFrom: '2024-01-01T00:00:00Z'
};


const mockUserDataWithVC: UserDataAuthenticationResponse = {
  sub: 'subValue',
  commonName: 'commonNameValue',
  country: 'countryValue',
  serialNumber: 'serialNumberValue',
  email_verified: true,
  preferred_username: 'preferred_usernameValue',
  given_name: 'givenNameValue',
  vc: mockCredentialEmployee, 
  'tenant-id': 'tenant-idValue',
  emailAddress: 'someone@example.com',
  organizationIdentifier: 'ORG123',
  organization: 'Test Organization',
  name: 'John Doe',
  family_name: 'Doe',
  role: RoleType.LEAR
};

const mockUserDataWithCert: UserDataAuthenticationResponse = {
  sub: 'subCert',
  commonName: 'Cert Common Name',
  country: 'CertLand',
  serial_number: '99999999',
  serialNumber: '99999999',
  email_verified: true,
  preferred_username: 'certUser',
  given_name: 'CertGivenName',
  'tenant-id': 'tenant-123',
  email:'cert-user@example.com',
  emailAddress: 'cert-user@example.com',
  organizationIdentifier: 'ORG-CERT',
  organization: 'Cert Organization',
  name: 'John Cert',
  family_name: 'Cert',
  // Propiedad 'cert' (de tipo EIDASCertificate) está definida opcionalmente.
  role: RoleType.LEAR
};

const mockUserDataNoVCNoCert: UserDataAuthenticationResponse = {
  sub: 'subCert',
  commonName: 'Cert Common Name',
  country: 'CertLand',
  serialNumber: '99999999',
  email_verified: true,
  preferred_username: 'certUser',
  given_name: 'CertGivenName',
  'tenant-id': 'tenant-123',
  emailAddress: 'cert-user@example.com',
  organizationIdentifier: 'ORG-CERT',
  organization: 'Cert Organization',
  name: 'John Cert',
  family_name: 'Cert',
};

describe('AuthService', () => {
  let service: AuthService;

  // We'll mock OidcSecurityService and any direct dependencies (like normalizer).
  let oidcSecurityServiceMock: {
    checkAuth: jest.Mock,
    authorize: jest.Mock,
    logoffAndRevokeTokens: jest.Mock
  };

  let extractVcSpy: jest.SpyInstance; 
 

  beforeEach(() => {
    oidcSecurityServiceMock = {
      checkAuth: jest.fn().mockReturnValue(of({ 
        isAuthenticated: false,
        userData: null,
        accessToken: null 
      })),
      authorize: jest.fn(),
      logoffAndRevokeTokens: jest.fn()
    };
    jest.spyOn(LEARCredentialEmployeeDataNormalizer.prototype, 'normalizeLearCredential')
    .mockImplementation((data) => data);

    
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: OidcSecurityService, useValue: oidcSecurityServiceMock },

      ]
    });

    service = TestBed.inject(AuthService);

    extractVcSpy = jest.spyOn(service as any, 'extractVCFromUserData');

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        clear: jest.fn()
      },
      writable: true
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  // ----------------------------------------------------------------------------
  // Basic creation / login / logout
  // ----------------------------------------------------------------------------
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call authorize on OidcSecurityService when login() is called', () => {
    service.login();
    expect(oidcSecurityServiceMock.authorize).toHaveBeenCalled();
  });

  it('should call logoffAndRevokeTokens when logout() is called', () => {
    service.logout();
    expect(oidcSecurityServiceMock.logoffAndRevokeTokens).toHaveBeenCalled();
  });

  // ----------------------------------------------------------------------------
  // Observables: isLoggedIn, getUserData, getEmailName, getToken, getName, etc.
  // ----------------------------------------------------------------------------
  it('should return false initially for isLoggedIn()', done => {
    service.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(false);
      done();
    });
  });

  it('should return null for getUserData() initially', done => {
    service.getUserData().subscribe(userData => {
      expect(userData).toBeNull();
      done();
    });
  });

  it('should return "" for getEmailName() initially', done => {
    service.getEmailName().subscribe(email => {
      expect(email).toBe('');
      done();
    });
  });

  it('should return "" for getToken() initially', done => {
    service.getToken().subscribe(token => {
      expect(token).toBe('');
      done();
    });
  });

  it('should return "" for getName() initially', done => {
    service.getName().subscribe(name => {
      expect(name).toBe('');
      done();
    });
  });

  // ----------------------------------------------------------------------------
  // hasPower()
  // ----------------------------------------------------------------------------
  it('should return true if user has "Onboarding" power with action array containing "Execute"', () => {
    (service as any).userPowers = [
      { function: 'Onboarding', action: ['Read', 'Execute', 'Write'] }
    ];
    expect(service.hasPower('Onboarding', 'Execute')).toBe(true);
  });

  it('should return false if user has "Onboarding" power but lacks "Execute"', () => {
    (service as any).userPowers = [
      { function: 'Onboarding', action: ['Read', 'Write'] }
    ];
    expect(service.hasPower('Onboarding', 'Execute')).toBe(false);
  });

  it('should return false if user has no "Onboarding" power', () => {
    (service as any).userPowers = [
      { function: 'OtherFunction', action: 'Execute' }
    ];
    expect(service.hasPower('Onboarding', 'Execute')).toBe(false);
  });

  it('should return false if userPowers is empty', () => {
    (service as any).userPowers = [];
    expect(service.hasPower('Onboarding', 'Execute')).toBe(false);
  });

  // ----------------------------------------------------------------------------
  // hasIn2OrganizationIdentifier()
  // ----------------------------------------------------------------------------
  it('should return true if organizationIdentifier is "VATES-B60645900"', () => {
    (service as any).mandatorSubject.next({
      organizationIdentifier: 'VATES-B60645900'
    });
    expect(service.hasIn2OrganizationIdentifier()).toBe(true);
  });

  it('should return false if organizationIdentifier is not "VATES-B60645900"', () => {
    (service as any).userDataSubject.next({
      organizationIdentifier: 'OTHER'
    });
    expect(service.hasIn2OrganizationIdentifier()).toBe(false);
  });

  it('should return false if userData is null', () => {
    (service as any).userDataSubject.next(null);
    expect(service.hasIn2OrganizationIdentifier()).toBe(false);
  });

  // ----------------------------------------------------------------------------
  // getMandator()
  // ----------------------------------------------------------------------------
  it('should return mandatorSubject as an observable', done => {
    const mockMandator = {
      organizationIdentifier: 'ORG123',
      organization: 'Test Org',
      commonName: 'Some Name',
      emailAddress: 'some@example.com',
      serialNumber: '123',
      country: 'SomeCountry'
    };
    (service as any).mandatorSubject.next(mockMandator);

    service.getMandator().subscribe(mandator => {
      expect(mandator).toEqual(mockMandator);
      done();
    });
  });

  // ----------------------------------------------------------------------------
  // handleLoginCallback()
  // ----------------------------------------------------------------------------
  it('should set userData and token if user is authenticated and has Onboarding Execute (via VC)', done => {
    oidcSecurityServiceMock.checkAuth.mockReturnValue(of({
      isAuthenticated: true,
      userData: mockUserDataWithVC,
      accessToken: 'test-token'
    }));
    // we also want to ensure the 'extractVCFromUserData' is not null
    extractVcSpy.mockReturnValue(mockCredentialEmployee);

    service.handleLoginCallback();

    // Check final states
    service.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(true);

      service.getUserData().subscribe(ud => {
        expect(ud).toEqual(mockUserDataWithVC);

        service.getToken().subscribe(token => {
          expect(token).toBe('test-token');
          done();
        });
      });
    });
  });

  it('should call logout if user is authenticated, but missing Onboarding Execute power', () => {
    const credWithoutOnboarding = {
      credentialSubject: {
        mandate: {
          mandator: { emailAddress: 'whatever@x.com' },
          mandatee: { firstName: 'x', lastName: 'y' },
          power: [ { function: 'OtherFunction', action: 'Write' } ]
        }
      }
    };

    oidcSecurityServiceMock.checkAuth.mockReturnValue(of({
      isAuthenticated: true,
      userData: { ...mockUserDataWithVC, vc: credWithoutOnboarding },
      accessToken: 'abc'
    }));
    const logoutSpy = jest.spyOn(service, 'logout');

    service.handleLoginCallback();
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should call logout if user is authenticated but has no VC and no cert', () => {
    oidcSecurityServiceMock.checkAuth.mockReturnValue(of({
      isAuthenticated: true,
      userData: mockUserDataNoVCNoCert,
      accessToken: 'some-token'
    }));
    const logoutSpy = jest.spyOn(service, 'logout');

    service.handleLoginCallback();
    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should do nothing special (not set subjects) if user is not authenticated', done => {
    oidcSecurityServiceMock.checkAuth.mockReturnValue(of({
      isAuthenticated: false,
      userData: null,
      accessToken: ''
    }));

    service.handleLoginCallback();

    service.isLoggedIn().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(false);
      service.getUserData().subscribe(ud => {
        expect(ud).toBeNull();
        service.getToken().subscribe(token => {
          expect(token).toBe('');
          done();
        });
      });
    });
  });

  // ----------------------------------------------------------------------------
  // handleUserAuthentication() - direct coverage
  // ----------------------------------------------------------------------------
  it('should handle Verifiable Credential flow in handleUserAuthentication()', () => {
    // Spy on handleVCLogin to confirm call
    const handleVCLoginSpy = jest.spyOn(service as any, 'handleVCLogin');
    extractVcSpy.mockReturnValue(mockCredentialEmployee);

    (service as any).handleUserAuthentication(mockUserDataWithVC);
    expect(LEARCredentialEmployeeDataNormalizer.prototype.normalizeLearCredential).toHaveBeenCalled();
    expect(handleVCLoginSpy).toHaveBeenCalled();
    expect(service.roleType()).toBe(RoleType.LEAR);
  });
   
  it('should return the user role if present', () => {
    const mockUserData = { role: RoleType.LEAR } as UserDataAuthenticationResponse;
    const result = (service as any).getRole(mockUserData);
    expect(result).toBe(RoleType.LEAR);
  });
  
  it('should extract certificate data correctly', () => {
    const result = (service as any).extractDataFromCertificate(mockUserDataWithCert);

    expect(result).toEqual({
      organizationIdentifier: mockUserDataWithCert.organizationIdentifier,
      organization: mockUserDataWithCert.organization,
      commonName: mockUserDataWithCert.name,
      emailAddress: mockUserDataWithCert.email ,
      serialNumber: mockUserDataWithCert.serialNumber ,
      country: mockUserDataWithCert.country
    });

  })

  it('should catch error if neither VC nor cert is present', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    extractVcSpy.mockReturnValue(null);

    (service as any).handleUserAuthentication(mockUserDataNoVCNoCert);

    expect(consoleErrorSpy).toHaveBeenCalled(); 
  });

  // ----------------------------------------------------------------------------
  // checkAuth() coverage
  // ----------------------------------------------------------------------------
  it('should mark user as authenticated and invoke handleUserAuthentication if checkAuth sees a valid user', done => {
    const handleUserAuthSpy = jest.spyOn(service as any, 'handleUserAuthentication');
    oidcSecurityServiceMock.checkAuth.mockReturnValue(of({
      isAuthenticated: true,
      userData: mockUserDataWithVC,
      accessToken: 'xxx'
    }));

    service.checkAuth().subscribe(result => {
      expect(result).toBe(true);
      expect(handleUserAuthSpy).toHaveBeenCalledWith(mockUserDataWithVC);
      service.isLoggedIn().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBe(true);
        done();
      });
    });
  });

  it('should mark user as not authenticated if checkAuth sees isAuthenticated=false', done => {
    oidcSecurityServiceMock.checkAuth.mockReturnValue(of({
      isAuthenticated: false,
      userData: mockUserDataWithCert,
      accessToken: ''
    }));

    service.checkAuth().subscribe(result => {
      expect(result).toBe(false);
      service.isLoggedIn().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBe(false);
        done();
      });
    });
  });
});
