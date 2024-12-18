import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";

@Component({
  selector: 'app-credential-offer-onboarding',
  standalone: true,
  imports: [TranslateModule, NavbarComponent,],
  templateUrl: './credential-offer-onboarding.component.html',
  styleUrl: './credential-offer.component.scss'
})
export class CredentialOfferOnboardingComponent implements OnInit{
  private transactionCode = ""
  public walletUrl = environment.wallet_url;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.transactionCode = params['transaction_code'];

    });
  }
public redirect() {
  this.router.navigate(['/credential-offer-detail'], {queryParams: {"transaction_code":this.transactionCode}});
}

}
