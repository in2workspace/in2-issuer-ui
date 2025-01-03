import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CredentialOfferComponent } from '../../credential-offer-steps/credential-offer/credential-offer.component';
import { CredentialOfferOnboardingComponent } from '../../credential-offer-steps/credential-offer-onboarding/credential-offer-onboarding.component';
import { Component, computed, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatIcon } from '@angular/material/icon';
import { catchError, EMPTY, filter, map, merge, Observable, of, startWith, Subject, switchMap, tap, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';
import { CredentialProcedureService, GetCredentialOfferResponse } from 'src/app/core/services/credential-procedure.service';
import { HttpErrorResponse } from '@angular/common/http';
import {BreakpointObserver} from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

export type StepperIndex = 0 | 1;
export type CredentialOfferStep = 'onboarding' | 'qr';
export type CredentialOfferParams = {
  credential_offer_uri: string|undefined,
  transaction_code: string|undefined,
  c_transaction_code: string|undefined,
  loading: boolean
}

@Component({
  selector: 'app-credential-offer-stepper',
  standalone: true,
  imports: [CredentialOfferComponent, CredentialOfferOnboardingComponent, MatIcon, MatStepperModule, MatButtonModule, NavbarComponent, QRCodeModule],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
}],
  templateUrl: './credential-offer-stepper.component.html',
  styleUrl: './credential-offer-stepper.component.scss'
})
export class CredentialOfferStepperComponent implements OnInit{
  //Source actions
  public updateIndex$$ = new Subject<StepperIndex>();
  public getUrlParams$$ = new Subject<void>();
  
  //Effects
  public updateUrlParamsEffect = { next: (offer:CredentialOfferParams) => this.updateUrlParams(offer) };

  //States
  public currentIndex$ = toSignal<StepperIndex>(this.updateIndex$$.pipe(startWith(0 as StepperIndex)));
  public currentStep$ = computed<CredentialOfferStep>(() => {
    return this.currentIndex$() === 0 ? 'onboarding' : 'qr';
  });
  public urlParams$: Observable<CredentialOfferParams> = this.getUrlParams$$.pipe(switchMap(() => this.getUrlParams()));
  public fetchedCredentialOffer$: Observable<CredentialOfferParams> = this.updateIndex$$.pipe(
    filter(() => this.currentIndex$() === 1),
    switchMap(()=>this.getCredentialOffer().pipe(
      map(params=>{ return { ...params, loading: false } }),
      //todo errors
      catchError(error=>{ 
        console.error(error);
        const params = this.offerParams$() ?? { 
          credential_offer_uri: undefined,
          transaction_code: undefined,
          c_transaction_code: undefined
        };
        return of({ 
          ...params,
          loading: false
        })
      }),
      startWith({ 
        credential_offer_uri: undefined,
        transaction_code: undefined,
        c_transaction_code: undefined,
        loading: true
      })
    )),
    //Effect
    tap(this.updateUrlParamsEffect)
  );

  public offerParams$: Signal<CredentialOfferParams|undefined> = toSignal(
    merge(this.urlParams$, this.fetchedCredentialOffer$)
    .pipe(startWith({ 
      credential_offer_uri: undefined,
      transaction_code: undefined,
      c_transaction_code: undefined,
      loading: false
    })));
  
  public stepperOrientation$: Signal<StepperOrientation>;

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(DialogWrapperService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public constructor(){
    this.stepperOrientation$ = toSignal(this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical'))),
    {
      initialValue: 'horizontal'
    });
  }

  public ngOnInit(){
    //make urls params update react to offer params changes only after first
    this.getUrlParams$$.next();
  }

  public onButtonSelectedStepChange(){
    const index = this.currentIndex$() === 0 ? 1 :0;
    this.updateIndex$$.next(index);
  }

  public onLabelSelectedStepChange(index:number){
    console.log('lable change');
    if (index !== this.currentIndex$() && (index === 0 || index === 1)) {
      this.updateIndex$$.next(index);
    }
  }

  public getUrlParams(): Observable<CredentialOfferParams>{
    const transactionCodeParam = this.route.snapshot.queryParamMap.get('transaction_code') ?? undefined;
    const cCodeParam = this.route.snapshot.queryParamMap.get('c') ?? undefined;

    if(!transactionCodeParam){
      console.error("Transaction code not found. Can't get credential offer");
      return EMPTY;
    }
    const updatedParams: CredentialOfferParams = {
      credential_offer_uri: undefined,
      transaction_code: transactionCodeParam,
      c_transaction_code: cCodeParam,
      loading: false
    };
    return of(updatedParams);
  }

  public getCredentialOffer(): Observable<CredentialOfferParams>{
    const offer = this.offerParams$();
    let params: Observable<never|CredentialOfferParams> = throwError(()=>new Error('No transaction nor c code to fetch credential offer.'));
    
    //todo reducer
    const mapParams = (obs:Observable<any>) => obs.pipe(map(codes=>{
      return {...this.offerParams$(), ...codes }
    }));

    if(offer?.c_transaction_code){
      params = mapParams(this.getCredentialOfferByCTransactionCode(offer.c_transaction_code))
    }else if(offer?.transaction_code){
      params = mapParams(this.getCredentialOfferByTransactionCode(offer.transaction_code));
    }else{
      this.dialog.openErrorInfoDialog("Transaction code not found. Can't get credential offer");
    }
    return params;
  }

  public getCredentialOfferByTransactionCode(transactionCode:string): Observable<GetCredentialOfferResponse> {
    if(!transactionCode){
      const message = "No transaction code was found in the URL, can't refresh QR.";
      this.dialog.openErrorInfoDialog(message);
      return throwError(()=>new Error());
    }

    return this.credentialProcedureService.getCredentialOfferByTransactionCode(transactionCode)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        this.dialog.openErrorInfoDialog('The credential offer has expired or already been used.');
        return throwError(()=>error);
      })
    )
  }

  public getCredentialOfferByCTransactionCode(cCode:string): Observable<GetCredentialOfferResponse> {
    if (!cCode) {
      const message = "No c-transaction code was found, can't refresh QR.";
      this.dialog.openErrorInfoDialog(message);
      return throwError(()=>new Error());
    }
  
    return this.credentialProcedureService.getCredentialOfferByCTransactionCode(cCode)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          //todo move to service?
          const errorStatus = error?.status || error?.error?.status || 0;
          let errorMessage = 'An unexpected error occurred. Please try again later.';
          if (errorStatus === 404) {
            errorMessage = 'This credential offer has expired or already been used.';
          } else if (errorStatus === 409) {
            errorMessage = 'The credential has already been obtained.';
          }
          this.dialog.openErrorInfoDialog(errorMessage);
          return throwError(()=>error);
        })
      )
  }

  public updateUrlParams(offerParams:CredentialOfferParams): void{
      const cCode = offerParams.c_transaction_code;
      const cCodeParam = cCode ? {c:cCode} : undefined;
        if(cCodeParam){
          this.router.navigate(
            [], {
              queryParams: cCodeParam,
              queryParamsHandling: 'merge'
            }
          );
      }
  }

}