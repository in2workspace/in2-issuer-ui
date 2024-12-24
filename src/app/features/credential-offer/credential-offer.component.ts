import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialProcedureService, refreshCredentialOfferResponse } from 'src/app/core/services/credential-procedure.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { TranslatePipe } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { NgIf } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { MatButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-credencial-offer',
    templateUrl: './credential-offer.component.html',
    styleUrls: ['./credential-offer.component.scss'],
    standalone: true,
    imports: [NavbarComponent, NgIf, QRCodeModule, TranslatePipe, MatButton]
})
export class CredentialOfferComponent implements OnInit {
  public qrCodeData?: string;
  public transactionCode?: string;
  public cTransactionCode?: string;

  private credentialOfferObserver = {
    next: (data: refreshCredentialOfferResponse) => {
        this.qrCodeData = data.credential_offer_uri;
        this.cTransactionCode = data.c_transaction_code;
        console.info('QR Code Data:', this.qrCodeData);
    }
  };

  private readonly route = inject(ActivatedRoute);
  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.transactionCode = params['transaction_code'];
        this.getCredentialOfferByTransactionCode();
    });
  }

  public getCredentialOfferByTransactionCode(): void {
    const transactionCode = this.transactionCode;
    if(!transactionCode){
      this.alertService.showAlert('No transaction code found in URL.', 'error');
    }

    this.credentialProcedureService.getCredentialOfferByTransactionCode(transactionCode!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(this.credentialOfferObserver);
  }

  public getCredentialOfferByCTransactionCode(): void{
    const cTransactionCode = this.cTransactionCode;
    if(!cTransactionCode){
      this.alertService.showAlert('No c-transaction code found.', 'error');
    }
    this.credentialProcedureService.getCredentialOfferByCTransactionCode(cTransactionCode!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(this.credentialOfferObserver);
  }



}
