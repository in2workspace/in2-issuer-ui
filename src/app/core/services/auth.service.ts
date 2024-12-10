import { inject, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDataAuthenticationResponse } from "../models/dto/user-data-authentication-response.dto";
import { Mandator, Power, Signer } from "../models/entity/lear-credential-employee.entity";

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

        const learCredential = this.extractVCFromUserData(userData)

        const mandator = {
          organizationIdentifier: learCredential.credentialSubject.mandate.mandator.organizationIdentifier,
          organization: learCredential.credentialSubject.mandate.mandator.organization,
          commonName: learCredential.credentialSubject.mandate.mandator.commonName,
          emailAddress: learCredential.credentialSubject.mandate.mandator.emailAddress,
          serialNumber: learCredential.credentialSubject.mandate.mandator.serialNumber,
          country: learCredential.credentialSubject.mandate.mandator.country
        };
        this.mandatorSubject.next(mandator);

        const  signer = {
          organizationIdentifier: learCredential.credentialSubject.mandate.signer.organizationIdentifier,
          organization: learCredential.credentialSubject.mandate.signer.organization,
          commonName: learCredential.credentialSubject.mandate.signer.commonName,
          emailAddress: learCredential.credentialSubject.mandate.signer.emailAddress,
          serialNumber: learCredential.credentialSubject.mandate.signer.serialNumber,
          country: learCredential.credentialSubject.mandate.signer.country
        }
        this.signerSubject.next(signer)

        const emailName = learCredential.credentialSubject.mandate.mandator.emailAddress.split('@')[0];
        const name = learCredential.credentialSubject.mandate.mandatee.first_name + ' ' + learCredential.credentialSubject.mandate.mandatee.last_name;

        this.emailSubject.next(emailName);
        this.nameSubject.next(name);
      }
      return isAuthenticated;
    }));
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

}
