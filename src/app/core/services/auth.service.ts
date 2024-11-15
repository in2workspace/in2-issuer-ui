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
  private rol="";
  private userPowers: any[] = [];

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
        this.userPowers = this.extractUserPowers(userData);
        const hasOnboardingPower = this.hasOnboardingExecutePower();

        if (!hasOnboardingPower) {
          throw new Error('Unauthorized: Missing OnBoarding power');
        }

        this.userDataSubject.next(userData);
        this.tokenSubject.next(accessToken);

        const base64Url = this.tokenSubject.getValue().split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        // TODO Delete rol management. Now policy management
        this.rol= JSON.parse(jsonPayload)['resource_access']['account-console']['roles'][0]



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

  private extractUserPowers(userData: any): any[] {
    return userData.vc?.credentialSubject?.mandate?.power || [];
  }

  // POLICY: login_restriction_policy
  private hasOnboardingExecutePower(): boolean {
    return this.userPowers.some((power: any) => {
      if (power.tmf_function === "Onboarding") {
        const action = power.tmf_action;
        return action === "Execute" || (Array.isArray(action) && action.includes("Execute"));
      }
      return false;
    });
  }

  // POLICY: user_powers_restriction_policy
  public hasIn2OrganizationIdentifier() : boolean {
    const userData = this.userDataSubject.getValue(); // Obtener los datos del usuario del BehaviorSubject
    return "VATEU-B99999999" === userData.vc?.credentialSubject?.mandator?.organizationIdentifier;
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

        this.userPowers = this.extractUserPowers(userData);
        const hasOnboardingPower = this.hasOnboardingExecutePower();

        if (!hasOnboardingPower) {
          console.error('Unauthorized: Missing OnBoarding power');
          this.logout();
          return;
        }

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
  public getRol(): any{
    return this.rol;
  }
  public getUserPowers() {
    return this.userPowers;
  }
}
