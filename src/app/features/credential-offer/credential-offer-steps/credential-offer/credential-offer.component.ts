import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { NgIf, UpperCasePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-credential-offer',
    templateUrl: './credential-offer.component.html',
    styleUrls: ['./credential-offer.component.scss'],
    standalone: true,
    imports: [NgIf, QRCodeModule, TranslatePipe, UpperCasePipe]
})
export class CredentialOfferComponent{
  @Output() public refreshCredential = new EventEmitter<void>();
  public qrColor = "#2d58a7";
  public walletUsersGuideUrl = environment.knowledgebase_url + "books/dome-digital-wallet-user-guide";
  public credentialOfferUri$ = input.required<string>();

  public readonly walletSameDeviceUrl = environment.wallet_url + 'tabs/home/';
  public walletSameDeviceUrl$ = computed<string>(()=>{
    const cutOfferUri = this.removeProtocol(this.credentialOfferUri$());
    return this.walletSameDeviceUrl + cutOfferUri
  });

  //TEST URLS
  public profile = environment.profile; 
  public readonly walletSameDeviceTestUrl = environment.wallet_url_test + 'tabs/home/';
  
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
