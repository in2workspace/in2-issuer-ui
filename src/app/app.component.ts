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
private readonly translate = inject(TranslateService);

public constructor(){
    const lang = 'en';
    
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
}
}
