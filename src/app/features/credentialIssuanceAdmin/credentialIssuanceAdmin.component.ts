import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-credential-issuance-admin',
  templateUrl: './credentialIssuanceAdmin.component.html'
})
export class CredentialIssuanceAdminComponent implements OnInit{
  public rol = "admin";
  public constructor(
    private route: ActivatedRoute,
  ){}
  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.rol = params.get('id')??"";
    });
  }
}
