import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { NgIf } from '@angular/common';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-credential-offer',
    templateUrl: './credential-offer.component.html',
    styleUrls: ['./credential-offer.component.scss'],
    standalone: true,
    imports: [NavbarComponent, NgIf, QRCodeModule, TranslatePipe]
})
export class CredentialOfferComponent {
  public readonly walletSameDeviceUrl = environment.wallet_url + '/tabs/home/openid-credential-offer?';
  public walletUsersGuideUrl = environment.knowledgebase_url + "books/dome-digital-wallet-user-guide";
  public qrColor = "#2d58a7";

  public credentialOfferUri$ = input.required<string>();
  public walletSameDeviceUrl$ = computed<string>(()=>this.walletSameDeviceUrl + 'credential_offer_uri=' + this.credentialOfferUri$());

}
