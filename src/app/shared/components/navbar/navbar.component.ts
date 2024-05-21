import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public userName: string = 'User Name';
  public companyName: string = '';
  public languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'ca', label: 'Català' },
  ];
  public selectedLanguage = 'en';

  public constructor(
    public translate: TranslateService,
    private authService: AuthService,
    // private router: Router,
  ) {}

  public ngOnInit() {
    this.translate.addLangs(['en', 'es', 'ca']);
    this.translate.setDefaultLang('en');
    this.selectedLanguage = this.translate.getDefaultLang();
    // this.loadMandatorData();
  }

  public logout(): void {
    this.authService.logout();
  }

  public changeLanguage(languageCode: string): void {
    this.translate.use(languageCode);
    this.selectedLanguage = languageCode;
  }

  // public loadMandatorData(): void {

  //       this.userName = mandator.commonName;
  //       this.companyName = mandator.organization;
  //     }
  // }
}
