import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-credencial-offer',
  templateUrl: './credencial-offer.component.html',
  styleUrls: ['./credencial-offer.component.scss']
})
export class CredencialOfferComponent implements OnInit {
  public qrCodeData?: string;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private credentialProcedureService: CredentialProcedureService,
    private alertService: AlertService
  ) {}

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
    this.credentialProcedureService.getCredentialOffer(transactionCode).subscribe(
      data => {
        if (data) {
          this.qrCodeData = data;
          console.log('QR Code Data:', this.qrCodeData);
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { transaction_code: transactionCode },
            queryParamsHandling: 'merge'
          });
        } else {
          this.alertService.showAlert('No QR code available.', 'error');
        }
      }
    );
  }
}
