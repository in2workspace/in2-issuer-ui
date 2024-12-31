import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { NgIf } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';

@Component({
    selector: 'app-credential-offer',
    templateUrl: './credential-offer.component.html',
    styleUrls: ['./credential-offer.component.scss'],
    standalone: true,
    imports: [NavbarComponent, NgIf, QRCodeModule, TranslatePipe]
})
export class CredentialOfferComponent implements OnInit {
  public qrCodeData?: string;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly dialog = inject(DialogWrapperService);
  private readonly translate = inject(TranslateService);

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const transactionCode = params['transaction_code'];
      if (transactionCode) {
        this.getCredentialOffer(transactionCode);
      } else {
        const translatedMessage = this.translate.instant('error.credentialOffer.no_transaction_code');
        this.dialog.openErrorInfoDialog(translatedMessage);
      }
    });
  }

  private getCredentialOffer(transactionCode: string): void {
    this.credentialProcedureService.getCredentialOffer(transactionCode).subscribe({
      next: (data) => {
        if (data) {
          this.qrCodeData = data;
          console.info('QR Code Data:', this.qrCodeData);
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { transaction_code: transactionCode },
            queryParamsHandling: 'merge'
          });
        } else {
          const translatedMessage = this.translate.instant("error.credentialOffer.no_qr");
          this.dialog.openErrorInfoDialog(translatedMessage);
        }
      },
      error: () => {
        const translatedMessage = this.translate.instant("error.credentialOffer.default");
        this.dialog.openErrorInfoDialog(translatedMessage);
      }
    });
  }
}
