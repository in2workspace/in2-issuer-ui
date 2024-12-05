import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormCredentialComponent } from '../../shared/components/form-credential/form-credential.component';

@Component({
  selector: 'app-credential-issuance',
  templateUrl: './credentialIssuance.component.html',
  standalone: true,
  imports: [FormCredentialComponent],
})
export class CredentialIssuanceComponent implements OnInit {
  public rol = '';

  private readonly route = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.rol = params.get('id') ?? '';
    });
  }
}
