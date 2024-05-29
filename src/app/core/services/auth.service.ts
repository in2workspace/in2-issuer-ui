import { Injectable } from '@angular/core';
import { OidcSecurityService,  } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated$: Observable<boolean>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;

  public constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    this.checkAuth().subscribe();
  }

  public checkAuth(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth().pipe(map(({ isAuthenticated }) => {
      console.log('checkAuth:', isAuthenticated);
      this.isAuthenticatedSubject.next(isAuthenticated);
      return isAuthenticated;
    }));
  }

  public login(): void {
    console.log('Logging in...');
    this.oidcSecurityService.authorize();
  }

  public loginAndRedirect(): void {
    console.log('Starting login and redirect...');
    this.oidcSecurityService.authorize();

    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated }) => {
      console.log('isAuthenticated$ subscription after login:', isAuthenticated);
      if (isAuthenticated) {
        console.log('Redirecting to /credentialManagement');
        this.router.navigate(['/credentialManagement']);
      } else {
        console.log('Authentication failed or not completed yet.');
      }
    });
  }

  public logout(): void {
    console.log('Logging out...');
    localStorage.clear();
    this.oidcSecurityService.logoff();
    this.isAuthenticatedSubject.next(false);
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$;
  }
}
