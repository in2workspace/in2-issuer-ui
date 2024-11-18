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
  private tokenSubject: BehaviorSubject<string>; //TODO es necesario?¿
  private mandatorSubject: BehaviorSubject<any>;
  private emailSubject: BehaviorSubject<string>;
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
        this.userDataSubject.next(userData);

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
    try {
      const vcObject = userData.vc ? JSON.parse(userData.vc) : null;
      return vcObject?.credentialSubject?.mandate?.power || [];
    } catch (error) {
      console.error('Failed to parse vc or extract user powers:', error);
      return [];
    }
  }


  // POLICY: login_restriction_policy
  public hasOnboardingExecutePower(): boolean {
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
    const userData = this.userDataSubject.getValue();
    return "VATEU-B99999999" === userData.organizationIdentifier;
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

  public getUserPowers() {
    return this.userPowers;
  }
}
