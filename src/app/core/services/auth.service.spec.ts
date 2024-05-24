import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, of } from 'rxjs';

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

    service = TestBed.inject(AuthService);
    oidcSecurityService = TestBed.inject(OidcSecurityService) as jasmine.SpyObj<OidcSecurityService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#checkAuth', () => {
    it('should set isAuthenticatedSubject based on OidcSecurityService checkAuth response', (done: DoneFn) => {
      const loginResponse$ = new BehaviorSubject<LoginResponse>({
        isAuthenticated: true,
        userData: {},
        accessToken: 'dummyAccessToken',
        idToken: 'dummyIdToken'
      });
      oidcSecurityService.checkAuth.and.returnValue(loginResponse$.asObservable());

      service.checkAuth().subscribe(isAuthenticated => {
        expect(isAuthenticated).toBeTrue();
        service.isLoggedIn().subscribe(isLoggedIn => {
          expect(isLoggedIn).toBeTrue();
          done();
        });
      });
    });
  });

  describe('#login', () => {
    it('should call authorize on OidcSecurityService', () => {
      service.login();
      expect(oidcSecurityService.authorize).toHaveBeenCalled();
    });
  });

  describe('#logout', () => {
    it('should clear localStorage and call logoff on OidcSecurityService', () => {
      spyOn(localStorage, 'clear').and.callThrough();
      service.logout();
      expect(localStorage.clear).toHaveBeenCalled();
      expect(oidcSecurityService.logoff).toHaveBeenCalled();
    });
  });

  describe('#isLoggedIn', () => {
    it('should return isAuthenticatedSubject as observable', (done: DoneFn) => {
      service.isLoggedIn().subscribe(isLoggedIn => {
        expect(isLoggedIn).toBeFalse();
        done();
      });
    });
  });
});
