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
  public cTransactionCode?: string;
  private currentTransactionCode?: string;
  private isFirstTransactionCode: boolean = true;

  private credentialOfferCallback = {
    next: (data: refreshCredentialOfferResponse) => {
      if (data) {
        this.qrCodeData = data.credential_offer_uri;
        this.cTransactionCode = data.c_transaction_code;
        console.info('QR Code Data:', this.qrCodeData);
      } else {
        this.alertService.showAlert('No QR code available.', 'error');
      }
    }
  };

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.route.queryParams
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(params => {
      this.currentTransactionCode = params['transaction_code'];
      this.getCredentialOffer(this.isFirstTransactionCode);
      this.isFirstTransactionCode = false;
    });
  }

  public updateCurrentTransactionCode(){
    if(this.cTransactionCode){
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { transaction_code: this.cTransactionCode },
        queryParamsHandling: 'merge'
      });
    }else{
      this.alertService.showAlert('No transaction code')
    }
  }

  private getCredentialOffer(isFirstTransactionCode:boolean){
    const transactionCode = this.currentTransactionCode;
    if(!transactionCode){
      this.alertService.showAlert('No transaction code found in URL.', 'error');
    }

    if(isFirstTransactionCode){
      this.getFirstCredentialOffer(transactionCode!);
    }else{
      this.refreshCredentialOffer(transactionCode!);
    }
  }

  private getFirstCredentialOffer(transactionCode:string): void {
    this.credentialProcedureService.getCredentialOffer(transactionCode!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(this.credentialOfferCallback);
  }

  private refreshCredentialOffer(transactionCode:string): void{
    this.credentialProcedureService.refreshCredentialOffer(transactionCode!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(this.credentialOfferCallback);
  }



}
