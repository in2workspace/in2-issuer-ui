import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-credential-issuance-admin',
  templateUrl: './credentialIssuanceAdmin.component.html'
})
export class CredentialIssuanceAdminComponent implements OnInit{
  public rol = "admin";
  public translate = inject(TranslateService);
  public title = timer(0).pipe(switchMap(()=>this.translate.get("credentialIssuance.learCredentialEmployee")));
  public constructor(
    private route: ActivatedRoute,
  ){}
  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.rol = params.get('id')??"";
    });
  }
}
