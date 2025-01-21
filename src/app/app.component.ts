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
    const lng = 'es';
    
    this.translate.setDefaultLang(lng!);
    this.translate.use(lng!);
}
}
