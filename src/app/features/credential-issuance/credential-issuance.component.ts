import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormCredentialComponent } from '../../shared/components/form-credential/form-credential.component';
import { map, take } from "rxjs/operators";

@Component({
    selector: 'app-credential-issuance-admin',
    templateUrl: './credential-issuance.component.html',
    standalone: true,
    imports: [FormCredentialComponent, AsyncPipe, TranslatePipe]
})
export class CredentialIssuanceComponent {
  public readonly route = inject(ActivatedRoute);
  public asSigner$ : Observable<boolean> = this.route.paramMap.pipe(
    take(1),
    map(params => !!params.get('id')))
  

}
