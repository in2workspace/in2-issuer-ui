import { Component, computed, EventEmitter, input, Output, OnInit } from '@angular/core';
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
export class CredentialOfferComponent implements OnInit{
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

public ngOnInit(){
  console.log('profile: ');
  console.log(this.profile);
  console.log('wallet url test: ');
  console.log(environment.wallet_url_test);
  console.log('wallet same device test url');
  console.log(this.walletSameDeviceTestUrl);
  console.log('wallet full same device test url');
  console.log(this.walletSameDeviceTestUrl$());

}

}
