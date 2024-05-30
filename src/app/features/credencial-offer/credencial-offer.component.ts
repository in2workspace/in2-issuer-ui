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
      console.log('Transaction Code:', transactionCode);
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
        console.log('Data received from API:', data);
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
      },
      error => {
        this.alertService.showAlert('Error fetching credential offer.', 'error');
        console.error('Error fetching credential offer', error);
      }
    );
  }
}
