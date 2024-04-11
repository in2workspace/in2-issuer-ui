import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  private users = [
    { username: 'issuer', password: '1234' }
  ];

  public login(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      this.isAuthenticated.next(true);
      return true;
    } else {
      this.isAuthenticated.next(false);
      return false;
    }
  }

  public register(username: string, password: string): boolean {
    const userExists = this.users.some(u => u.username === username);
    if (!userExists) {
      this.users.push({ username, password });

      return true;
    } else {
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
