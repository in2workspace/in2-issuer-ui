import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {
public title = 'Credential-issuer-ui';
private translate = inject(TranslateService);

public constructor(){
    //todo check if there is better way to handle this
    const supportedLangs = ["en", "es", "ca"];
    let lng = this.translate.getBrowserLang();
    
    if (lng && !supportedLangs.includes(lng)) {
      lng = "en";
    }
    
    this.translate.setDefaultLang(lng!);
    this.translate.use(lng!);
    
    supportedLangs.forEach((language) => {
      this.translate.reloadLang(language);
    });
    
}
}
