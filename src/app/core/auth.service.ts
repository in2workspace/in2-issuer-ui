import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private readonly fakeUser = { username: 'issuer', password: '1234' };

 public login(username: string, password: string): boolean {
    if (username === this.fakeUser.username && password === this.fakeUser.password) {
      this.isAuthenticated.next(true);
      return true;
    } else {
      this.isAuthenticated.next(false);
      return false;
    }
  }

  public logout(): void {
    this.isAuthenticated.next(false);
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
}
