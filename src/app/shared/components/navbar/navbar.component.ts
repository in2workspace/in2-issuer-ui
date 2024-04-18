import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public userName: string = 'User Name';
  public companyName: string = 'Company Name';

  public languages = [
    { code: 'EN', label: 'EN' },
    { code: 'ES', label: 'ES' },
    { code: 'CA', label: 'CA' }
  ];
  public selectedLanguage = 'EN';

  public constructor(private authService: AuthService) {}

  public logout(): void {
    this.authService.logout();
  }

  public changeLanguage(languageCode: string) {
    this.selectedLanguage = languageCode;
  }
}
