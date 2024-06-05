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
  private mandatorSubject: BehaviorSubject<any>;
  private emailSubject: BehaviorSubject<string>;

  public constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    this.userDataSubject = new BehaviorSubject<any>(null);
    this.tokenSubject = new BehaviorSubject<string>('');
    this.mandatorSubject = new BehaviorSubject<any>(null);
    this.emailSubject = new BehaviorSubject<string>('');

    this.checkAuth().subscribe();
  }

  public checkAuth(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth().pipe(map(({ isAuthenticated, userData, accessToken }) => {
      this.isAuthenticatedSubject.next(isAuthenticated);
      if (isAuthenticated) {
        this.userDataSubject.next(userData);
        this.tokenSubject.next(accessToken);

        const mandator = {
          organizationIdentifier: userData.organizationIdentifier,
          organization: userData.organization,
          commonName: userData.commonName,
          emailAddress: userData.emailAddress,
          serialNumber: userData.serialNumber,
          country: userData.country
        };
        this.mandatorSubject.next(mandator);
        const emailName = userData.emailAddress.split('@')[0];
        this.emailSubject.next(emailName);
      }
      return isAuthenticated;
    }));
  }

  public getMandator(): Observable<any> {
    return this.mandatorSubject.asObservable();
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
}
