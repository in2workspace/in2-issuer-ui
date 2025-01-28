import { inject, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDataAuthenticationResponse } from "../models/dto/user-data-authentication-response.dto";
import { Mandator, Power, Signer } from "../models/entity/lear-credential-employee.entity";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private readonly userDataSubject = new BehaviorSubject<UserDataAuthenticationResponse |null>(null);
  private readonly tokenSubject = new BehaviorSubject<string>('');
  private readonly mandatorSubject = new BehaviorSubject<Mandator | null>(null);
  private readonly signerSubject = new BehaviorSubject<Signer | null>(null);
  private readonly emailSubject = new BehaviorSubject<string>('');
  private readonly nameSubject = new BehaviorSubject<string>('');
  private readonly profile =`${environment.profile}`;


  private userPowers: Power[] = [];

  private readonly oidcSecurityService = inject(OidcSecurityService);

  constructor() {
    this.checkAuth().subscribe();
  }

  public checkAuth(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth().pipe(map(({ isAuthenticated, userData}) => {
      this.isAuthenticatedSubject.next(isAuthenticated);

      if (isAuthenticated) {
        console.log("AuthService --> checkAuth() --> isAuthenticated? TRUE");
        this.userPowers = this.extractUserPowers(userData);
        this.userDataSubject.next(userData);

        console.log("AuthService --> checkAuth() --> UserData: " + userData);

        const learCredential = this.extractVCFromUserData(userData)

        console.log("AuthService --> checkAuth() --> LearCredential: " + learCredential);

        const mandator = {
          organizationIdentifier: learCredential.credentialSubject.mandate.mandator.organizationIdentifier,
          organization: learCredential.credentialSubject.mandate.mandator.organization,
          commonName: learCredential.credentialSubject.mandate.mandator.commonName,
          emailAddress: learCredential.credentialSubject.mandate.mandator.emailAddress,
          serialNumber: learCredential.credentialSubject.mandate.mandator.serialNumber,
          country: learCredential.credentialSubject.mandate.mandator.country
        };
        this.mandatorSubject.next(mandator);

        const signer = this.getProfileSigner()
        this.signerSubject.next(signer)

        const emailName = learCredential.credentialSubject.mandate.mandator.emailAddress.split('@')[0];
        const name = learCredential.credentialSubject.mandate.mandatee.first_name + ' ' + learCredential.credentialSubject.mandate.mandatee.last_name;

        this.emailSubject.next(emailName);
        this.nameSubject.next(name);
      }
      return isAuthenticated;
    }));
  }


  private extractVCFromUserData(userData: UserDataAuthenticationResponse) {
    return userData.vc || null;
  }

  private extractUserPowers(userData: UserDataAuthenticationResponse): Power[] {
    try {
      const learCredential = this.extractVCFromUserData(userData)
      return learCredential?.credentialSubject.mandate.power || [];
    } catch (error) {
      return [];
    }
  }

  private getProfileSigner() {
      if (this.profile && this.profile !== 'production') {
        return {
          organizationIdentifier: "VATEU-B99999999",
          organization: "OLIMPO",
          commonName: "ZEUS OLIMPOS",
          emailAddress: "domesupport@in2.es",
          serialNumber: "IDCEU-99999999P",
          country: "EU",
        };
      } else {
        return {
          organizationIdentifier: "VATES-Q0000000J",
          organization: "DOME Credential Issuer",
          commonName: "56565656P Jesus Ruiz",
          emailAddress: "jesus.ruiz@in2.es",
          serialNumber: "IDCES-56565656P",
          country: "ES",
        };
      }
    }

  // POLICY: onboarding_execute_policy
  public hasOnboardingExecutePower(): boolean {
    return this.userPowers.some((power: Power) => {
      console.log("AuthService --> hasOnboardingExecutePower() --> Pre If Check")
      if (power.tmf_function === "Onboarding") {
        console.log("AuthService --> hasOnboardingExecutePower() --> Power.tmf_function has Onboarding")
        const action = power.tmf_action;
        console.log("AuthService --> hasOnboardingExecutePower() --> Action? " + action)
        return action === "Execute" || (Array.isArray(action) && action.includes("Execute"));
      }
      console.log("AuthService --> hasOnboardingExecutePower() --> Power.tmf_function NOT! has Onboarding")
      return false;
    });
  }

  // POLICY: onboarding_delegate_policy
  public hasOnboardingDelegatePower(): boolean {
    return this.userPowers.some((power: Power) => {
      if (power.tmf_function === "Onboarding") {
        const action = power.tmf_action;
        return action === "Delegate" || (Array.isArray(action) && action.includes("Delegate"));
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

  // POLICY: is_super_admin_policy
  public isSuperAdmin(): boolean {
    return this.hasOnboardingDelegatePower() && this.hasIn2OrganizationIdentifier();
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
    return this.oidcSecurityService.logoffAndRevokeTokens();
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  public getUserData(): Observable<UserDataAuthenticationResponse | null> {
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
