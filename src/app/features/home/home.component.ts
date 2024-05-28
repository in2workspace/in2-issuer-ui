import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public constructor(private router: Router, public authService: AuthService) {}

  public login() {
    this.authService.login();
  }
  public navigateToPage(page: string) {
    this.router.navigate([`/${page}`]);
  }
  public logout() {
    console.log('Logging out...');
    this.router.navigate(['/login']);
  }
}
