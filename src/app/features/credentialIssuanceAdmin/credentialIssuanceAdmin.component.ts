import {Component, inject, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credential-issuance-admin',
  templateUrl: './credentialIssuanceAdmin.component.html'
})
export class CredentialIssuanceAdminComponent implements OnInit{
  public rol = "admin";

  private readonly route = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.rol = params.get('id')??"";
    });
  }
}
