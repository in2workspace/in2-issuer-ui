import { Component } from '@angular/core';

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


  public logout(): void {
    console.log('Logging out...');
  }

  public changeLanguage(languageCode: string) {
    this.selectedLanguage = languageCode;
  }
}
