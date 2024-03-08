import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, switchMap, tap} from 'rxjs';
import {environment} from 'src/environments/environment';
import {OidcSecurityService} from 'angular-auth-oidc-client';

@Injectable({
    providedIn: 'root',
  })
  export class AuthenticationService {
  
    isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
      false
    );
    token: any;
    userData: any;
  
    constructor(public oidcSecurityService: OidcSecurityService) {
      this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken }) => {
        this.isAuthenticated.next(isAuthenticated);
        console.log("userData:", userData, "accesToken:", accessToken);
        this.userData = userData;
        this.token = accessToken;
      });
    }

    public getFullName():string {
      console.log("getFullName", this.token.name);
      return this.userData.name;
    }
    public getUsername():string {
      return this.userData.preferred_username;
    }
    public getGivenName():string {
      return this.userData.given_name;
    }
    public getFamilyName():string {
      return this.userData.family_name;
    }
    public getEmail():string {
      return this.userData.email;
    }
    public getToken():string {
      return this.token;
    }

    logout() {
      return this.oidcSecurityService.logoff().pipe(
        map((data: any) => {
          this.token = data.accessToken;
          return this.token;
        }),
        switchMap((token) => {
          return token;
        }),
        tap((_) => {
          this.isAuthenticated.next(true);
        })
      );
    }
}