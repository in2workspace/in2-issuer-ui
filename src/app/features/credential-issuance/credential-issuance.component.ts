import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable, of, switchMap, timer } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormCredentialComponent } from '../../shared/components/form-credential/form-credential.component';
import { map } from "rxjs/operators";

@Component({
    selector: 'app-credential-issuance-admin',
    templateUrl: './credential-issuance.component.html',
    standalone: true,
    imports: [FormCredentialComponent, AsyncPipe, TranslatePipe]
})
export class CredentialIssuanceComponent {
  public asSigner$ : Observable<boolean> = this.route.paramMap.pipe(map(params => !!params.get('id')))
  public constructor(
    private readonly route: ActivatedRoute,
  ) {}

}
