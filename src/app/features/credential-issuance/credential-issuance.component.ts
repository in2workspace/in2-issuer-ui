import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {Subscription, switchMap, timer} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormCredentialComponent } from '../../shared/components/form-credential/form-credential.component';

@Component({
    selector: 'app-credential-issuance-admin',
    templateUrl: './credential-issuance.component.html',
    standalone: true,
    imports: [FormCredentialComponent, AsyncPipe]
})
export class CredentialIssuanceComponent implements OnInit, OnDestroy {
  public rol = "admin";
  public translate = inject(TranslateService);
  public title = timer(0).pipe(switchMap(() => this.translate.get("credentialIssuance.learCredentialEmployee")));
  private subscription : Subscription | undefined
  public constructor(
    private route: ActivatedRoute,
  ) {
  }

  public ngOnInit(): void {
    this.subscription = this.route.paramMap.subscribe(params => {
      this.rol = params.get('id') ?? "";
    });
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
