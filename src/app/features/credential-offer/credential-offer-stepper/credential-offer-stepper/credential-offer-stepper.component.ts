import { toSignal } from '@angular/core/rxjs-interop';
import { CredentialOfferComponent } from './../../credential-offer.component';
import { CredentialOfferOnboardingComponent } from './../../../credential-offer-onboarding/credential-offer-onboarding.component';
import { Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatIcon } from '@angular/material/icon';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

export type CredentialOfferIndex = 0 | 1;
export type CredentialOfferStep = 'onboarding' | 'qr';
export type CredentialOfferParams = {
  credential_offer_uri?: string,
  transactionCode?: string,
  cTranstacionCode?: string
}

@Component({
  selector: 'app-credential-offer-stepper',
  standalone: true,
  imports: [CredentialOfferComponent, CredentialOfferOnboardingComponent, MatIcon, MatStepperModule, MatButtonModule, NavbarComponent, QRCodeModule],
  templateUrl: './credential-offer-stepper.component.html',
  styleUrl: './credential-offer-stepper.component.scss'
})
export class CredentialOfferStepperComponent implements OnInit{
  public walletUrl = environment.wallet_url + '/credential-offer';

  public currentIndexSubj$ = new BehaviorSubject<CredentialOfferIndex>(0);
  public currentIndexObs$ = this.currentIndexSubj$.asObservable();
  public currentIndex$ = toSignal<CredentialOfferIndex>(this.currentIndexObs$);

  public currentStep$ = computed<CredentialOfferStep>(()=>{
    return this.currentIndex$() === 0 ? 'onboarding' : 'qr';
  });

  public getOfferEffectOnIndexOne = effect(()=>{
    const currentIndex = this.currentIndex$();
    if(currentIndex===1){
      this.getCredentialOffer();
    }
  });
  public offerState = signal<CredentialOfferParams>({
    credential_offer_uri: undefined,
    transactionCode: undefined,
    cTranstacionCode: undefined
  });
  public walletCredentialOfferUrl = computed<string>(()=>{
    const offer = this.offerState();
    const cCodeParam = offer.cTranstacionCode ? `?c=${offer.cTranstacionCode}` : '';
    return this.walletUrl + '?credential_offer_uri=' + offer.credential_offer_uri + cCodeParam;
  });
  public updateUrlParamsEffect = effect(()=>{
    const cCode = this.offerState().cTranstacionCode;
    const cCodeParam = cCode ? {c:cCode} : undefined;
    if(cCodeParam){
      this.router.navigate(
        [], {
          queryParams: cCodeParam,
          queryParamsHandling: 'merge'
        }
      );
  }
  });

  // Actions
  //todo usar actions i implementar request --> update de state
  public updateIndex$$ = new Subject();
  public getCredential$$ = new Subject();
  public updateUrl$$ = new Subject();

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public ngOnInit(){
    const transactionCodeParam = this.route.snapshot.queryParamMap.get('transaction_code'); //todo decidir nom param, posar-ho a ruta?

  }

  public updateCurrentIndex = (index:CredentialOfferIndex) => { this.currentIndexSubj$.next(index)};

  public onSelectedStepChange(index:number){
    if (index === 0 || index === 1) {
      this.updateCurrentIndex(index);
    }
  }

  public getCredentialOffer(){

  }

}
