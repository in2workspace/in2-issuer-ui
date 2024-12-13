import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: true,
    imports: [RouterLink, MatIcon],
})
export class NavbarComponent implements OnInit {
  public userName: string = '';
  public organization: string = '';
  public selectedLanguage = 'en';

  private readonly translate = inject(TranslateService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

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
