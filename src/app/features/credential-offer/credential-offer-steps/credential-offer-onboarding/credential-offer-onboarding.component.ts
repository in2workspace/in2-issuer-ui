import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {environment} from 'src/environments/environment';
import {QRCodeModule} from 'angularx-qrcode';
import {KNOWLEDGEBASE_PATH} from 'src/app/core/constants/knowledge.constants';
import {API} from "../../../../core/constants/api.constants";

@Component({
  selector: 'app-credential-offer-onboarding',
  standalone: true,
  imports: [QRCodeModule, TranslatePipe],
  templateUrl: './credential-offer-onboarding.component.html',
  styleUrl: './credential-offer-onboarding.component.scss'
})
export class CredentialOfferOnboardingComponent{
  public qrColor = "#2d58a7";
  public walletUsersGuideUrl = environment.knowledge_base_url + KNOWLEDGEBASE_PATH.WALLET;

  public walletUrl = environment.wallet_url || 'https://wallet.dome-marketplace.eu/';
  public walletTestUrl = API.WALLET_URL_TEST || 'https://wallet.dome-marketplace.eu/';
  public readonly showWalletSameDeviceUrlTest =  API.SHOW_WALLET_URL_TEST;
}
