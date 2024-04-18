import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private users = [
  //   { username: 'issuer', password: '1234' }
  // ];


  // public register(username: string, password: string): boolean {
  //   const userExists = this.users.some(u => u.username === username);
  //   if (!userExists) {
  //     this.users.push({ username, password });

  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public constructor(private oidcSecurityService: OidcSecurityService) {
    this.checkAuth().subscribe();
  }

  public checkAuth(): Observable<boolean> {
    return this.oidcSecurityService.checkAuth().pipe(map(({ isAuthenticated }) => {
      this.isAuthenticatedSubject.next(isAuthenticated);
      return isAuthenticated;
    }));
  }

  public login(): void {
    this.oidcSecurityService.authorize();
  }

  public logout(): void {
    localStorage.clear();
    this.oidcSecurityService.logoff();
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }


}
