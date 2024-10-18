import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-credential-offer-onboarding',
  standalone: true,
  imports: [SharedModule, TranslateModule,
  ],
  templateUrl: './credential-offer-onboarding.component.html',
  styleUrl: './credential-offer-onboarding.component.scss'
})
export class CredentialOfferOnboardingComponent implements OnInit{
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private transactionCode = ""
  public walletUrl = environment.wallet_url;
  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.transactionCode = params['transaction_code'];
      
    });
  }
public redirect() {
  this.router.navigate(['/credential-offer-detail'], {queryParams: {"transaction_code":this.transactionCode}});
}

}
