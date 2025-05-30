import {Component, computed, EventEmitter, input, Output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {QRCodeModule} from 'angularx-qrcode';
import {environment} from 'src/environments/environment';
import {KNOWLEDGEBASE_PATH} from 'src/app/core/constants/knowledge.constants';
import {API} from "../../../../core/constants/api.constants";

@Component({
    selector: 'app-credential-offer',
    templateUrl: './credential-offer.component.html',
    styleUrls: ['./credential-offer.component.scss'],
    standalone: true,
    imports: [QRCodeModule, TranslatePipe]
})
export class CredentialOfferComponent{
  @Output() public refreshCredential = new EventEmitter<void>();
  public qrColor = "#2d58a7";
  public walletUsersGuideUrl = environment.knowledge_base_url + KNOWLEDGEBASE_PATH.WALLET;
  public credentialOfferUri$ = input.required<string>();

  public readonly walletSameDeviceUrl = environment.wallet_url + '/tabs/home/';
  public walletSameDeviceUrl$ = computed<string>(()=>{
    const cutOfferUri = this.removeProtocol(this.credentialOfferUri$());
    return this.walletSameDeviceUrl + cutOfferUri
  });

  //TEST URLS
  public readonly showWalletSameDeviceUrlTest =  API.SHOW_WALLET_URL_TEST;
  public readonly walletSameDeviceTestUrl = API.WALLET_URL_TEST + '/tabs/home/';

  public walletSameDeviceTestUrl$ = computed<string>(()=>{
    const cutOfferUri = this.removeProtocol(this.credentialOfferUri$());
    return this.walletSameDeviceTestUrl + cutOfferUri
  });


  //currently needed because of backend response
  public removeProtocol(input: string): string {
     return input.replace(/:\/\//g, '');
}

public onRefreshCredentialClick(event:Event): void{
  event.preventDefault();
  this.refreshCredential.emit();
}

}
