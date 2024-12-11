import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormCredentialComponent } from '../../shared/components/form-credential/form-credential.component';
import {TranslateService} from "@ngx-translate/core";
import {switchMap, timer} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-credential-issuance',
  templateUrl: './credentialIssuance.component.html',
  standalone: true,
  imports: [FormCredentialComponent, AsyncPipe],
})
export class CredentialIssuanceComponent implements OnInit {
  public rol = '';
  public title = timer(0).pipe(switchMap(()=>this.translate.get("credentialIssuance.learCredentialEmployee")));
  public translate = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.rol = params.get('id') ?? '';
    });
  }
}
