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

  public asSigner$: Observable<boolean> = this.route.url.pipe(
    map(segments => {
      const lastSegment = segments[segments.length - 1]?.path;
      return lastSegment === 'create-as-signer';
    })
  );
}
