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
    console.log('HomeComponent: login button clicked');
    this.authService.loginAndRedirect();
  }

  public navigateToPage(page: string) {
    console.log(`Navigating to page: ${page}`);
    this.router.navigate([`/${page}`]);
  }

  public logout() {
    console.log('HomeComponent: logging out');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
