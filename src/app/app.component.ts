import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {
public title = 'Credential-issuer-ui';
private readonly translate = inject(TranslateService);

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
}
}
