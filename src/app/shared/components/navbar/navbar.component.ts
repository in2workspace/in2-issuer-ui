import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public userName: string = '';
  public organization: string = '';
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
        this.organization = mandator.organization
      }
    })
    this.authService.getName().subscribe(name => {
      if (name) {
        this.userName = name;
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
