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
  private nameSubject: BehaviorSubject<string>;

  public constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    this.userDataSubject = new BehaviorSubject<any>(null);
    this.tokenSubject = new BehaviorSubject<string>('');
    this.nameSubject = new BehaviorSubject<string>('');

    this.checkAuth().subscribe();
  }

  public checkAuth(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth().pipe(map(({ isAuthenticated, userData, accessToken }) => {
      this.isAuthenticatedSubject.next(isAuthenticated);
      if (isAuthenticated) {
        this.userDataSubject.next(userData);
        this.nameSubject.next(userData.name);
        this.tokenSubject.next(accessToken);
      }
      return isAuthenticated;
    }));
  }

  public login(): void {
    this.oidcSecurityService.authorize();
  }

  public handleLoginCallback(): void {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken }) => {
      if (isAuthenticated) {
        this.isAuthenticatedSubject.next(true);
        this.userDataSubject.next(userData);
        this.nameSubject.next(userData.name);
        this.tokenSubject.next(accessToken);
      } else {
        console.log('Authentication failed or not completed yet.');
      }
    });
  }

  public logout() {
    return this.oidcSecurityService.logoff();
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  public getUserData(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  public getName(): Observable<string> {
    return this.nameSubject.asObservable();
  }

  public getToken(): Observable<string> {
    return this.tokenSubject.asObservable();
  }
}
