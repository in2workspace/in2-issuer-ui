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

  it('should set isAuthenticatedSubject based on OidcSecurityService checkAuth response', (done: DoneFn) => {
    const authResponse = {
      isAuthenticated: true,
      userData: {},
      accessToken: 'dummyAccessToken',
      idToken: 'dummyIdToken'
    };
    oidcSecurityService.checkAuth.and.returnValue(of(authResponse));

    service.checkAuth().subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeTrue();
      service.isLoggedIn().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeTrue();
        done();
      });
    });
  });

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
      userData: { name: 'John Doe' },
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
          done();
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

  it('should return first name as observable when getFirstName is called', (done: DoneFn) => {
    service.getFirstName().subscribe(firstName => {
      expect(firstName).toBe('');
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
