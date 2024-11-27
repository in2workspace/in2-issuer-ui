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
  private signerSubject: BehaviorSubject<any>;
  private emailSubject: BehaviorSubject<string>;
  private nameSubject: BehaviorSubject<string>;

  private userPowers: any[] = [];

  public constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    this.userDataSubject = new BehaviorSubject<any>(null);
    this.tokenSubject = new BehaviorSubject<string>('');
    this.mandatorSubject = new BehaviorSubject<any>(null);
    this.signerSubject = new BehaviorSubject<any>(null);
    this.emailSubject = new BehaviorSubject<string>('');
    this.nameSubject = new BehaviorSubject<string>('');

    this.checkAuth().subscribe();
  }

  public checkAuth(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth().pipe(map(({ isAuthenticated, userData, accessToken }) => {
      this.isAuthenticatedSubject.next(isAuthenticated);

      if (isAuthenticated) {
        this.userPowers = this.extractUserPowers(userData);
        this.userDataSubject.next(userData);

        const vcObject = this.extractVCFromUserData(userData)

        const mandator = {
          organizationIdentifier: vcObject.credentialSubject.mandate.mandator.organizationIdentifier,
          organization: vcObject.credentialSubject.mandate.mandator.organization,
          commonName: vcObject.credentialSubject.mandate.mandator.commonName,
          emailAddress: vcObject.credentialSubject.mandate.mandator.emailAddress,
          serialNumber: vcObject.credentialSubject.mandate.mandator.serialNumber,
          country: vcObject.credentialSubject.mandate.mandator.country
        };
        this.mandatorSubject.next(mandator);

        const  signer = {
          organizationIdentifier: vcObject.credentialSubject.mandate.signer.organizationIdentifier,
          organization: vcObject.credentialSubject.mandate.signer.organization,
          commonName: vcObject.credentialSubject.mandate.signer.commonName,
          emailAddress: vcObject.credentialSubject.mandate.signer.emailAddress,
          serialNumber: vcObject.credentialSubject.mandate.signer.serialNumber,
          country: vcObject.credentialSubject.mandate.signer.country
        }
        this.signerSubject.next(signer)

        const emailName = vcObject.credentialSubject.mandate.mandator.emailAddress.split('@')[0];
        const name = vcObject.credentialSubject.mandate.mandatee.first_name + ' ' + vcObject.credentialSubject.mandate.mandatee.last_name;

        this.emailSubject.next(emailName);
        this.nameSubject.next(name);
      }
      return isAuthenticated;
    }));
  }

  private extractVCFromUserData(userData: any) {
    return userData.vc ? JSON.parse(userData.vc) : null;
  }

  private extractUserPowers(userData: any): any[] {
    try {
      const vcObject = this.extractVCFromUserData(userData)
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
        console.info('AuthService -- hasOnboardingExecutePower -- Onboarding power!');
        return action === "Execute" || (Array.isArray(action) && action.includes("Execute"));
      }
      console.error('AuthService -- hasOnboardingExecutePower -- NOT Onboarding power!');
      return false;
    });
  }

  // POLICY: user_powers_restriction_policy
  public hasIn2OrganizationIdentifier() : boolean {
    const userData = this.userDataSubject.getValue();
    if ("VATES-B60645900" === userData.organizationIdentifier) {
      console.info('AuthService -- hasIn2OrganizationIdentifier -- IN2 Organization Identifier found!');
      return true
    }
    console.error('AuthService -- hasIn2OrganizationIdentifier -- NOT IN2 Organization Identifier found!');
    return false;
  }

  public getMandator(): Observable<any> {
    return this.mandatorSubject.asObservable();
  }

  public getSigner(): Observable<any> {
    return this.signerSubject.asObservable();
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

  public getName(): Observable<string> {
    return this.nameSubject.asObservable()
  }

}
