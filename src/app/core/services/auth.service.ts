import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated$: Observable<boolean>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  private userDataSubject: BehaviorSubject<any>;
  private tokenSubject: BehaviorSubject<string>;
  private userDetailsSubject: BehaviorSubject<any>;
  private emailSubject: BehaviorSubject<string>;
  private roles: string[];
  public constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    this.userDataSubject = new BehaviorSubject<any>(null);
    this.tokenSubject = new BehaviorSubject<string>('');
    this.userDetailsSubject = new BehaviorSubject<any>(null);
    this.emailSubject = new BehaviorSubject<string>('');
    this.roles = [];

    this.checkAuth().subscribe();
  }

  public checkAuth(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth().pipe(map(({ isAuthenticated, userData, accessToken }) => {
      this.isAuthenticatedSubject.next(isAuthenticated);
      if (isAuthenticated) {
        this.userDataSubject.next(userData);
        this.tokenSubject.next(accessToken);

        const base64Url = this.tokenSubject.getValue().split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        this.roles = JSON.parse(jsonPayload)['resource_access']['account-console']['roles'];



        const userDetails = {
          organizationIdentifier: userData.organizationIdentifier,
          organization: userData.organization,
          commonName: userData.commonName,
          emailAddress: userData.emailAddress,
          serialNumber: userData.serialNumber,
          country: userData.country
        };
        this.userDetailsSubject.next(userDetails);
        const emailName = userData.emailAddress.split('@')[0];
        this.emailSubject.next(emailName);
      }
      return isAuthenticated;
    }));
  }

  public getUserDetails(): Observable<any> {
    return this.userDetailsSubject.asObservable();
  }

  public login(): void {
    this.oidcSecurityService.authorize();
  }

  public handleLoginCallback(): void {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken }) => {
      if (isAuthenticated) {
        this.isAuthenticatedSubject.next(true);
        this.userDataSubject.next(userData);
        this.tokenSubject.next(accessToken);
      } else {
        console.log('Authentication failed or not completed yet.');
      }
    });
  }

  public logout() {
    localStorage.clear();
    return this.oidcSecurityService.logoff();
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  public getUserData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  public getEmailName(): Observable<string> {
    return this.emailSubject.asObservable();
  }

  public getToken(): Observable<string> {
    return this.tokenSubject.asObservable();
  }
  public getRoles(): string[] {
    return this.roles;
  }
}
