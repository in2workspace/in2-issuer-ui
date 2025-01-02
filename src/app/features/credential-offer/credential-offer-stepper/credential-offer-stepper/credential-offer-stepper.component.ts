import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CredentialOfferComponent } from './../../credential-offer.component';
import { CredentialOfferOnboardingComponent } from './../../../credential-offer-onboarding/credential-offer-onboarding.component';
import { Component, computed, DestroyRef, effect, EffectRef, inject, Injector, OnInit, runInInjectionContext, Signal } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatIcon } from '@angular/material/icon';
import { catchError, EMPTY, filter, map, merge, Observable, startWith, Subject, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';
import { CredentialProcedureService, GetCredentialOfferResponse } from 'src/app/core/services/credential-procedure.service';
import { HttpErrorResponse } from '@angular/common/http';

export type StepperIndex = 0 | 1;
export type CredentialOfferStep = 'onboarding' | 'qr';
export type CredentialOfferParams = {
  credential_offer_uri: string|undefined,
  transaction_code: string|undefined,
  c_transaction_code: string|undefined
}

@Component({
  selector: 'app-credential-offer-stepper',
  standalone: true,
  imports: [CredentialOfferComponent, CredentialOfferOnboardingComponent, MatIcon, MatStepperModule, MatButtonModule, NavbarComponent, QRCodeModule],
  templateUrl: './credential-offer-stepper.component.html',
  styleUrl: './credential-offer-stepper.component.scss'
})
export class CredentialOfferStepperComponent implements OnInit{
  public updateIndex$$ = new Subject<StepperIndex>();
  public currentIndex$ = toSignal<StepperIndex>(this.updateIndex$$.pipe(startWith(0 as StepperIndex)));
  public currentStep$ = computed<CredentialOfferStep>(()=>{
    return this.currentIndex$() === 0 ? 'onboarding' : 'qr';
  });
  public getUrlParams$$ = new Subject<CredentialOfferParams>();
  public updateUrlParamsOnOfferChangeEffect: EffectRef|undefined;
  public loadCredential$$: Observable<CredentialOfferParams> = this.updateIndex$$.pipe(
    filter(() => this.currentIndex$() === 1),
    switchMap(()=>this.getCredentialOffer()));


  public offerState: Signal<CredentialOfferParams|undefined> = toSignal(
    merge(this.getUrlParams$$, this.loadCredential$$)
    .pipe(startWith({ 
      credential_offer_uri: undefined,
      transaction_code: undefined,
      c_transaction_code: undefined
    } as CredentialOfferParams)));

  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(DialogWrapperService);
  private readonly injector = inject(Injector);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public ngOnInit(){
    const transactionCodeParam = this.route.snapshot.queryParamMap.get('transaction_code') ?? undefined;
    const cCodeParam = this.route.snapshot.queryParamMap.get('c') ?? undefined;

    if(!transactionCodeParam){
      this.dialog.openErrorInfoDialog('Transaction code not found');
      this.updateUrlParamsOnOfferChangeEffect = this.initializeUpdateUrlParamsEffect();
      return;
    }
    const updatedParams: CredentialOfferParams = {
      credential_offer_uri: undefined,
      transaction_code: transactionCodeParam,
      c_transaction_code: cCodeParam
    };
    this.getUrlParams$$.next(updatedParams);

    this.updateUrlParamsOnOfferChangeEffect = this.initializeUpdateUrlParamsEffect();
  }

  public onSelectedStepChange(index:number){
    if (index === 0 || index === 1) {
      this.updateIndex$$.next(1)
    }
  }

  public getCredentialOffer(): Observable<CredentialOfferParams>{
    const offer = this.offerState();
    let params: Observable<never|CredentialOfferParams> = EMPTY;
    const mapParams = (obs:Observable<any>) => obs.pipe(map(codes=>{
      return {...this.offerState(), ...codes }
    }));

    if(offer?.c_transaction_code){
      params = mapParams(this.getCredentialOfferByCTransactionCode(offer.c_transaction_code))
    }else if(offer?.transaction_code){
      params = mapParams(this.getCredentialOfferByTransactionCode(offer.transaction_code));
    }
    return params;
  }

  public getCredentialOfferByTransactionCode(transactionCode:string): Observable<GetCredentialOfferResponse> {
    if(!transactionCode){
      const message = "No transaction code was found in the URL, can't refresh QR.";
      this.dialog.openErrorInfoDialog(message);
      return EMPTY;
    }

    return this.credentialProcedureService.getCredentialOfferByTransactionCode(transactionCode)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(() => {
        this.dialog.openErrorInfoDialog('The credential offer has expired or already been used.');
        return EMPTY;
      })
    )
  }

  public getCredentialOfferByCTransactionCode(cCode:string): Observable<GetCredentialOfferResponse> {
    if (!cCode) {
      const message = "No c-transaction code was found, can't refresh QR.";
      this.dialog.openErrorInfoDialog(message);
      return EMPTY;
    }
  
    return this.credentialProcedureService.getCredentialOfferByCTransactionCode(cCode)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          const errorStatus = error?.status || error?.error?.status || 0;
          let errorMessage = 'An unexpected error occurred. Please try again later.';
          if (errorStatus === 404) {
            errorMessage = 'This credential offer has expired or already been used.';
          } else if (errorStatus === 409) {
            errorMessage = 'The credential has already been obtained.';
          }
          this.dialog.openErrorInfoDialog(errorMessage);
          return EMPTY;
        })
      )
  }

  public initializeUpdateUrlParamsEffect(): EffectRef{
    return runInInjectionContext(this.injector, ()=>{return effect(()=>{
      const cCode = this.offerState()!.c_transaction_code;
      const cCodeParam = cCode ? {c:cCode} : undefined;
      if(cCodeParam){
        this.router.navigate(
          [], {
            queryParams: cCodeParam,
            queryParamsHandling: 'merge'
          }
        );
    }
    })})
    
  }

}
