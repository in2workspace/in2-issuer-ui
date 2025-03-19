import { inject, Injectable, WritableSignal, signal } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserDataAuthenticationResponse } from "../models/dto/user-data-authentication-response.dto";
import {LEARCredentialEmployee, Mandator, Power} from "../models/entity/lear-credential-employee.entity";
import { LEARCredentialEmployeeDataNormalizer } from '../models/entity/lear-credential-employee-data-normalizer';
import { RoleType } from '../models/enums/auth-rol-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private readonly userDataSubject = new BehaviorSubject<UserDataAuthenticationResponse |null>(null);
  private readonly tokenSubject = new BehaviorSubject<string>('');
  private readonly mandatorSubject = new BehaviorSubject<Mandator | null>(null);
  private readonly emailSubject = new BehaviorSubject<string>('');
  private readonly nameSubject = new BehaviorSubject<string>('');
  private readonly normalizer = new LEARCredentialEmployeeDataNormalizer();
  public readonly roleType: WritableSignal<RoleType> = signal(RoleType.LEAR);



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
        this.handleUserAuthentication(userData)
      }
      return isAuthenticated;
    }));
  }

  private handleUserAuthentication(userData: UserDataAuthenticationResponse): void {
     //TODO when accessing with certificate update signal role LER and  handleCertificateLogin
      try{
        const learCredential = this.extractVCFromUserData(userData);
        const normalizedCredential = this.normalizer.normalizeLearCredential(learCredential);
        this.handleVCLogin(normalizedCredential);
      } 
      catch(error){
        console.error(error)
      }
  }

  //TODO when role access is configured
  private getRole(userData: UserDataAuthenticationResponse):RoleType|null{
    if (userData?.role) {
      return userData.role;
    }
    return null;
  }

  private handleCertificateLogin(userData: UserDataAuthenticationResponse): void {
    const certData = this.extractDataFromCertificate(userData);
    this.mandatorSubject.next(certData);
    this.nameSubject.next(certData.commonName);
  }

  private extractDataFromCertificate(userData: UserDataAuthenticationResponse): Mandator {
    return {
        organizationIdentifier: userData.organizationIdentifier,
        organization: userData.organization,
        commonName: userData.name,
        emailAddress: userData?.email ?? '',
        serialNumber: userData?.serial_number ?? '',
        country: userData.country
      }
  };

  private handleVCLogin(learCredential: LEARCredentialEmployee): void {
    const mandator = {
      organizationIdentifier: learCredential.credentialSubject.mandate.mandator.organizationIdentifier,
      organization: learCredential.credentialSubject.mandate.mandator.organization,
      commonName: learCredential.credentialSubject.mandate.mandator.commonName,
      emailAddress: learCredential.credentialSubject.mandate.mandator.emailAddress,
      serialNumber: learCredential.credentialSubject.mandate.mandator.serialNumber,
      country: learCredential.credentialSubject.mandate.mandator.country
    };
    
    this.mandatorSubject.next(mandator);
  
    const emailName = learCredential.credentialSubject.mandate.mandator.emailAddress.split('@')[0];
    const name = learCredential.credentialSubject.mandate.mandatee.firstName + ' ' + learCredential.credentialSubject.mandate.mandatee.lastName;
  
    this.emailSubject.next(emailName);
    this.nameSubject.next(name);
    this.userPowers = this.extractUserPowers(learCredential);
  }

  public hasPower(tmfFunction: string, tmfAction: string): boolean {
    return this.userPowers.some((power: Power) => {
      if (power.function === tmfFunction) {
        const action = power.action;
        return action === tmfAction || (Array.isArray(action) && action.includes(tmfAction));
      }
      return false;
    });
  }

  // POLICY: user_powers_restriction_policy
  public hasIn2OrganizationIdentifier() : boolean {
    const mandatorData = this.mandatorSubject.getValue()
    if (mandatorData != null){
      return "VATES-B60645900" === mandatorData.organizationIdentifier;
    }
    return false
  }

  public getMandator(): Observable<Mandator | null> {
    return this.mandatorSubject.asObservable();
  }

  public login(): void {
    this.oidcSecurityService.authorize();
  }

  public handleLoginCallback(): void {
    this.oidcSecurityService.checkAuth()
      .pipe(take(1))
      .subscribe(({ isAuthenticated, userData, accessToken }) => {
        if (isAuthenticated ) {
          if(!userData?.role && !userData?.vc){
            this.logout();
            return;
          } 
          const learCredential = this.extractVCFromUserData(userData);

          if(learCredential!=null){
            const normalizedCredential = this.normalizer.normalizeLearCredential(learCredential);
            this.userPowers = this.extractUserPowers(normalizedCredential);
            const hasOnboardingPower = this.hasPower('Onboarding','Execute');
            if (!hasOnboardingPower) {
              this.logout();
              return;
            }
          }

          this.isAuthenticatedSubject.next(true);
          this.userDataSubject.next(userData);
          this.tokenSubject.next(accessToken);
        }
      });
  }

  public logout() {
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
    if(!userData?.vc){
      throw new Error('VC claim error.')
    }
    return userData.vc;
  }

  private extractUserPowers(learCredential: LEARCredentialEmployee): Power[] {
    try {
      return learCredential?.credentialSubject.mandate.power || [];
    } catch (error) {
      return [];
    }
  }
}