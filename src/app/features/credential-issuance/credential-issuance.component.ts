import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FormCredentialComponent } from '../../shared/components/form-credential/form-credential.component';

@Component({
    selector: 'app-credential-issuance-admin',
    templateUrl: './credential-issuance.component.html',
    standalone: true,
    imports: [FormCredentialComponent, TranslatePipe]
})
export class CredentialIssuanceComponent {
  public readonly route = inject(ActivatedRoute);

  public asSigner: boolean = this.route.snapshot.pathFromRoot
    .flatMap(r => r.url)
    .map(seg => seg.path)
    .includes('create-as-signer');
}
