import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd  } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { NavbarComponent } from '../app/shared/components/navbar/navbar.component';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, NavbarComponent]
})
export class AppComponent{
public title = 'Credential-issuer-ui';
private readonly translate = inject(TranslateService);
public showNavbar = true;
private readonly router= inject(Router)
private readonly document = inject(DOCUMENT);

public constructor(){
    this.setLanguage();
    this.setCustomColors();
    this.setFavicon();

    //todo do this declaratively
    this.router.events
    .pipe(takeUntilDestroyed())
    .subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !event.urlAfterRedirects.startsWith('/home');
      }
    });
 }

 private setLanguage(){
  const lang = 'en';
  this.translate.setDefaultLang(lang);
  this.translate.use(lang);
 }

 private setCustomColors(){
  const root = document.documentElement;
  const colors = environment.customizations.colors;

  const cssVarMap = {
    '--primary-custom-color': colors.primary,
    '--primary-contrast-custom-color': colors.primary_contrast,
    '--secondary-custom-color': colors.secondary,
    '--secondary-contrast-custom-color': colors.secondary_contrast,
  };

  Object.entries(cssVarMap).forEach(([cssVariable, colorValue]) => {
    root.style.setProperty(cssVariable, colorValue);
  });
 }

 private setFavicon(): void {
  const faviconSrc = environment.customizations.favicon_src;

  // load favicon from environment
  const faviconLink: HTMLLinkElement = this.document.querySelector("link[rel='icon']") || this.document.createElement('link');
  faviconLink.type = 'image/x-icon';
  faviconLink.rel = 'icon';
  faviconLink.href = 'assets/icons/' + faviconSrc;
  
  this.document.head.appendChild(faviconLink);

  // load apple-touch icon from environment
  const appleFaviconLink: HTMLLinkElement = this.document.querySelector("link[rel='apple-touch-icon']") || this.document.createElement('link');
  appleFaviconLink.type = 'image/x-icon';
  appleFaviconLink.rel = 'apple-touch-icon';
  appleFaviconLink.href = 'assets/icons/' + faviconSrc;
  
  this.document.head.appendChild(appleFaviconLink);
}


}
