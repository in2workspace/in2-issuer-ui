import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private credentialProcedureService: CredentialProcedureService,
    private alertService: AlertService
  ) {}

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const transactionCode = params.get('transaction_code');
      if (transactionCode) {
        this.getCredentialOffer(transactionCode);
      }
    });
  }

  private getCredentialOffer(transactionCode: string): void {
    this.credentialProcedureService.getCredentialOffer(transactionCode).subscribe(
      data => {
        if (data.qrCode) {
          this.qrCodeData = data.qrCode;
        } else {
          this.alertService.showAlert('No QR code available.', 'error');
        }
      },
      error => {
        this.alertService.showAlert('Error fetching credential offer.', 'error');
        console.error('Error fetching credential offer', error);
      }
    );
  }
}
