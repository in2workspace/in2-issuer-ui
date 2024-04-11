import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public user = '';
  public password = '';

  public constructor(public authService: AuthService, private router: Router) {}

  public login() {
    if (this.authService.login(this.user, this.password)) {
      console.log('Login successful');
      this.router.navigate(['/home']);

    } else {
      console.log('Login failed');

    }
  }
  public navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
