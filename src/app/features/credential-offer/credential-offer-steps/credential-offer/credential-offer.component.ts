import { Component, computed, EventEmitter, input, Output } from '@angular/core';
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
  @Output() public refreshCredential = new EventEmitter<void>();
  public readonly walletSameDeviceUrl = environment.wallet_url + 'tabs/home/';
  public walletUsersGuideUrl = environment.knowledgebase_url + "books/dome-digital-wallet-user-guide";
  public qrColor = "#2d58a7";

  public credentialOfferUri$ = input.required<string>();
  public walletSameDeviceUrl$ = computed<string>(()=>{
    const cutOfferUri = this.removeProtocol(this.credentialOfferUri$());
    return this.walletSameDeviceUrl + cutOfferUri
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
