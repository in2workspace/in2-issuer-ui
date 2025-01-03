import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-credential-offer-onboarding',
  standalone: true,
  imports: [QRCodeModule, TranslateModule],
  templateUrl: './credential-offer-onboarding.component.html',
  styleUrl: './credential-offer-onboarding.component.scss'
})
export class CredentialOfferOnboardingComponent{
  public walletUrl = environment.wallet_url || 'https://wallet.dome-marketplace-prd.org/';
  //todo environment?
  public walletUsersGuideUrl = "https://knowledgebase.dome-marketplace-prd.org/books/dome-digital-wallet-user-guide";
  public qrColor = "#2d58a7";

}
