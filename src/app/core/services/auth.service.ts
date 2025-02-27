import { inject, Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserDataAuthenticationResponse } from "../models/dto/user-data-authentication-response.dto";
import {LEARCredentialEmployee, Mandator, Power, Signer} from "../models/entity/lear-credential-employee.entity";
import {environment} from "../../../environments/environment";
import { LEARCredentialEmployeeDataNormalizer } from '../models/entity/lear-credential-employee-data-normalizer';


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
  private readonly normalizer = new LEARCredentialEmployeeDataNormalizer();



  private userPowers: Power[] = [];

  private readonly oidcSecurityService = inject(OidcSecurityService);

  public constructor() {
    this.checkAuth()
    .pipe(take(1))
    .subscribe();
  }

  public checkAuth(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth().pipe(
      take(1),
      map(({ isAuthenticated, userData}) => {
      this.isAuthenticatedSubject.next(isAuthenticated);

      if (isAuthenticated) {
        this.userDataSubject.next(userData);

        // Extract and normalize the VC using the normalizer class
        const learCredential = this.extractVCFromUserData(userData);
        const normalizedCredential = this.normalizer.normalizeLearCredential(learCredential);

        this.userPowers = this.extractUserPowers(normalizedCredential);


        const mandator = {
          organizationIdentifier: normalizedCredential.credentialSubject.mandate.mandator.organizationIdentifier,
          organization: normalizedCredential.credentialSubject.mandate.mandator.organization,
          commonName: normalizedCredential.credentialSubject.mandate.mandator.commonName,
          emailAddress: normalizedCredential.credentialSubject.mandate.mandator.emailAddress,
          serialNumber: normalizedCredential.credentialSubject.mandate.mandator.serialNumber,
          country: normalizedCredential.credentialSubject.mandate.mandator.country
        };
        this.mandatorSubject.next(mandator);

        const signer = this.getProfileSigner()
        this.signerSubject.next(signer)

        const emailName = normalizedCredential.credentialSubject.mandate.mandator.emailAddress.split('@')[0];
        const name = normalizedCredential.credentialSubject.mandate.mandatee.firstName + ' ' + normalizedCredential.credentialSubject.mandate.mandatee.lastName;

        this.emailSubject.next(emailName);
        this.nameSubject.next(name);
      }
      return isAuthenticated;
    }));
  }

  // POLICY: login_restriction_policy
  public hasOnboardingExecutePower(): boolean {
    return this.userPowers.some((power: Power) => {
      if (power.function === "Onboarding") {
        const action = power.action;
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
    this.oidcSecurityService.checkAuth()
      .pipe(take(1))
      .subscribe(({ isAuthenticated, userData, accessToken }) => {
        if (isAuthenticated) {

          const learCredential = this.extractVCFromUserData(userData);
          const normalizedCredential = this.normalizer.normalizeLearCredential(learCredential);
          this.userPowers = this.extractUserPowers(normalizedCredential);

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

  private extractVCFromUserData(userData: UserDataAuthenticationResponse) {
    return userData.vc || null;
  }

  private extractUserPowers(learCredential: LEARCredentialEmployee): Power[] {
    try {
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

}
