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
});
