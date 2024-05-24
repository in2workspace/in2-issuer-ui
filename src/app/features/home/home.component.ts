import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public constructor(private router: Router) {}

  public navigateToPage(page: string) {
    this.router.navigate([`/${page}`]);
  }
  public logout() {
    console.log('Logging out...');
    this.router.navigate(['/login']);
  }
}
