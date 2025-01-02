import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialProcedureService, refreshCredentialOfferResponse } from 'src/app/core/services/credential-procedure.service';
import { TranslatePipe } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { NgIf } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { MatButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';

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

  private readonly credentialOfferObserver = {
    next: (data: refreshCredentialOfferResponse) => {
        this.qrCodeData = data?.credential_offer_uri;
        const cCode = data?.c_transaction_code;
        this.cTransactionCode = cCode;
        if(cCode){
          this.router.navigate([], {
            queryParams: { c_code: data?.c_transaction_code },
            queryParamsHandling: 'merge',
            skipLocationChange: false,
          });
        }
        console.info('QR Code Data:', this.qrCodeData);
    }
  };

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly dialog = inject(DialogWrapperService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.transactionCode = params['transaction_code'];
        this.cTransactionCode = params['c_code'];
        if(this.cTransactionCode){
          this.getCredentialOfferByCTransactionCode();
        }else{
          this.getCredentialOfferByTransactionCode();
        }
    });
  }

  public getCredentialOfferByTransactionCode(): void {
    const transactionCode = this.transactionCode;
    if(!transactionCode){
      const message = "No transaction code was found in the URL, can't refresh QR.";
      this.dialog.openErrorInfoDialog(message);
      return;
    }

    this.credentialProcedureService.getCredentialOfferByTransactionCode(transactionCode!)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(() => {
        this.dialog.openErrorInfoDialog('The credential offer is expired or incorrect.');
        return EMPTY;
      })
    )
    .subscribe(this.credentialOfferObserver);
  }

  public getCredentialOfferByCTransactionCode(): void {
    const cTransactionCode = this.cTransactionCode;
    if (!cTransactionCode) {
      const message = "No c-transaction code was found, can't refresh QR.";
      this.dialog.openErrorInfoDialog(message);
      return;
    }
  
    this.credentialProcedureService.getCredentialOfferByCTransactionCode(cTransactionCode!)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          const errorStatus = error?.status || error?.error?.status || 0;
          let errorMessage = 'An unexpected error occurred. Please try again later.';
          if (errorStatus === 404) {
            errorMessage = 'This credential offer has expired.';
          } else if (errorStatus === 409) {
            errorMessage = 'This credential offer has already been activated.';
          }
          this.dialog.openErrorInfoDialog(errorMessage);
          return EMPTY;
        })
      )
      .subscribe(this.credentialOfferObserver);
  }

}