import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { QRCodeModule } from 'angularx-qrcode';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-credential-offer-onboarding',
  standalone: true,
  imports: [QRCodeModule, TranslateModule, UpperCasePipe],
  templateUrl: './credential-offer-onboarding.component.html',
  styleUrl: './credential-offer-onboarding.component.scss'
})
export class CredentialOfferOnboardingComponent{
  public qrColor = "#2d58a7";
  public walletUsersGuideUrl = environment.knowledgebase_url + "books/dome-digital-wallet-user-guide";
  
  public walletUrl = environment.wallet_url || 'https://wallet.dome-marketplace-prd.org/';
  public walletTestUrl = environment.wallet_url_test || 'https://wallet.dome-marketplace-prd.org/';
  public profile = environment.profile;
}
