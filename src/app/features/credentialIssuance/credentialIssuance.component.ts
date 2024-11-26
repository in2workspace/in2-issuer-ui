import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-credential-issuance',
  templateUrl: './credentialIssuance.component.html'
})
export class CredentialIssuanceComponent{
  public translate = inject(TranslateService);
  //doesn't load without delay
  public title = timer(0).pipe(switchMap(()=>this.translate.get("credentialIssuance.create")));
}
