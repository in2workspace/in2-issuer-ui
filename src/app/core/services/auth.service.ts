import { inject, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Power } from "../models/power.interface";
import { Signer } from "../models/signer.interface";
import { UserData } from "../models/userData.interface";
import { Mandator } from "../models/mandator.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private readonly userDataSubject = new BehaviorSubject<UserData |null>(null);
  private readonly tokenSubject = new BehaviorSubject<string>('');
  private readonly mandatorSubject = new BehaviorSubject<Mandator | null>(null);
  private readonly signerSubject = new BehaviorSubject<Signer | null>(null);
  private readonly emailSubject = new BehaviorSubject<string>('');
  private readonly nameSubject = new BehaviorSubject<string>('');

  private userPowers: Power[] = [];

  private readonly oidcSecurityService = inject(OidcSecurityService);

  constructor() {
    this.checkAuth().subscribe();
  }

  public checkAuth(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth().pipe(map(({ isAuthenticated, userData}) => {
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

  private extractVCFromUserData(userData: UserData) {
    return userData.vc ? JSON.parse(userData.vc) : null;
  }

  private extractUserPowers(userData: UserData): Power[] {
    try {
      const vcObject = this.extractVCFromUserData(userData)
      return vcObject?.credentialSubject?.mandate?.power || [];
    } catch (error) {
      return [];
    }
  }

  // POLICY: login_restriction_policy
  public hasOnboardingExecutePower(): boolean {
    return this.userPowers.some((power: Power) => {
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
    if (userData != null){
      return "VATES-B60645900" === userData.organizationIdentifier;
    }
    return false
  }

  public getMandator(): Observable<Mandator | null> {
    return this.mandatorSubject.asObservable();
  }

  public getSigner(): Observable<Signer | null> {
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
          this.logout();
          return;
        }

        this.isAuthenticatedSubject.next(true);
        this.userDataSubject.next(userData);
        this.tokenSubject.next(accessToken);
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

  public getUserData(): Observable<UserData | null> {
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
