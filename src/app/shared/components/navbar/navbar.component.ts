import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Mandator } from 'src/app/core/models/madator.interface';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() public mandator: Mandator | null = null;
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
    private router: Router,
  ) {}

  public ngOnInit() {
    this.translate.addLangs(['en', 'es', 'ca']);
    this.translate.setDefaultLang('en');
    this.selectedLanguage = this.translate.getDefaultLang();
    this.authService.getMandator().subscribe(mandator => {
      if (mandator) {
        this.mandator = mandator;
      }
    });
    this.authService.getUserData().subscribe(userData => {
      if (userData) {
        this.userName = `${userData.name}\n${userData.organization || ''}`;
      }
    });
  }

  public logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/home'], {});
    });
  }

  public changeLanguage(languageCode: string): void {
    this.translate.use(languageCode);
    this.selectedLanguage = languageCode;
  }
}
