import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { take } from 'rxjs';

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
    this.authService.getMandator()
      .pipe(take(1))
      .subscribe(mandator => {
        if (mandator) {
          this.organization = mandator.organization
        }
      })
    this.authService.getName()
      .pipe(take(1))
      .subscribe(name => {
        if (name) {
          this.userName = name;
        }
      });
  }

  public logout() {
    this.authService.logout()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['/home'], {});
      });
  }

  //currently not used
  public changeLanguage(languageCode: string): void {
    this.translate.use(languageCode);
    this.selectedLanguage = languageCode;
  }
}
