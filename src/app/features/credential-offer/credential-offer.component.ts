import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { TranslatePipe } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { NgIf } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
    selector: 'app-credencial-offer',
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
  private readonly alertService = inject(AlertService);

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const transactionCode = params['transaction_code'];
      if (transactionCode) {
        this.getCredentialOffer(transactionCode);
      } else {
        this.alertService.showAlert('No transaction code found in URL.', 'error');
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
          this.alertService.showAlert('No QR code available.', 'error');
        }
      },
      error: () => {
        this.alertService.showAlert('The credential offer is expired or already used.', 'error');
      }
    });
  }
}
