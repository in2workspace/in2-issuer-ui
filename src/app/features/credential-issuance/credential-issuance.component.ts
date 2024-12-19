import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, switchMap, timer } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormCredentialComponent } from '../../shared/components/form-credential/form-credential.component';
import { map } from "rxjs/operators";

@Component({
    selector: 'app-credential-issuance-admin',
    templateUrl: './credential-issuance.component.html',
    standalone: true,
    imports: [FormCredentialComponent, AsyncPipe]
})
export class CredentialIssuanceComponent {
  public translate = inject(TranslateService);
  public title = timer(0).pipe(switchMap(() => this.translate.get("credentialIssuance.learCredentialEmployee")));
  public asSigner$ : Observable<boolean|null> = this.route.paramMap.pipe(map(params => !!params.get('id')))
  public constructor(
    private readonly route: ActivatedRoute,
  ) {}

}
