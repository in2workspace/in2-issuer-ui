import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd  } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { NavbarComponent } from '../app/shared/components/navbar/navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, NavbarComponent]
})
export class AppComponent {
public title = 'Credential-issuer-ui';
private readonly translate = inject(TranslateService);
public showNavbar = true;
private readonly router= inject(Router)

public constructor(){
    const lang = 'en';
    
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    const root = document.documentElement;

    const cssVarMap = {
      '--primary-custom-color': environment.customizations.colors.primary,
      '--primary-contrast-custom-color': environment.customizations.colors.primary_contrast,
      '--secondary-custom-color': environment.customizations.colors.secondary,
      '--secondary-contrast-custom-color': environment.customizations.colors.secondary_contrast,
    };
  
    Object.entries(cssVarMap).forEach(([cssVariable, colorValue]) => {
      root.style.setProperty(cssVariable, colorValue);
    });
    let link_favicon: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (link_favicon) {
      link_favicon.href = environment.customizations.favicon_src;
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !event.urlAfterRedirects.startsWith('/home');
      }
    });
 }
}
