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
    token = '';
    userData: any;
  
    constructor(public oidcSecurityService: OidcSecurityService) {
      this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData, accessToken }) => {
        this.isAuthenticated.next(isAuthenticated);
        this.userData = userData;
        this.token = accessToken;
      });
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