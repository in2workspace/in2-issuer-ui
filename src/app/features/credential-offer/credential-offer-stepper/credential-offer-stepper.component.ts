import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CredentialOfferComponent } from '../credential-offer-steps/credential-offer/credential-offer.component';
import { CredentialOfferOnboardingComponent } from '../credential-offer-steps/credential-offer-onboarding/credential-offer-onboarding.component';
import { Component, computed, DestroyRef, effect, inject, OnInit, Signal, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatIcon } from '@angular/material/icon';
import { catchError, EMPTY, filter, interval, map, merge, Observable, of, scan, shareReplay, startWith, Subject, switchMap, take, tap, throwError, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogWrapperService } from 'src/app/shared/components/dialog/dialog-wrapper/dialog-wrapper.service';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CredentialOfferResponse } from 'src/app/core/models/dto/credential-offer-response';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { TemplatePortal } from '@angular/cdk/portal';

export type StepperIndex = 0 | 1;
export type CredentialOfferStep = 'onboarding' | 'offer';
export interface CredentialOfferParams {
  credential_offer_uri: string|undefined,
  transaction_code: string|undefined,
  c_transaction_code: string|undefined,
}
export interface CredentialOfferParamsState extends CredentialOfferParams {
  loading: boolean
}

export const undefinedCredentialOfferParamsState: CredentialOfferParamsState = { 
    credential_offer_uri: undefined,
    transaction_code: undefined,
    c_transaction_code: undefined,
    loading: false
  };

@Component({
  selector: 'app-credential-offer-stepper',
  standalone: true,
  imports: [
    AsyncPipe,
    CredentialOfferComponent, 
    CredentialOfferOnboardingComponent,
    MatButtonModule, 
    MatIcon, 
    MatProgressSpinnerModule, 
    MatStepperModule, 
    NavbarComponent, 
    QRCodeModule,
    TranslatePipe
    ],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
}],
  templateUrl: './credential-offer-stepper.component.html',
  styleUrl: './credential-offer-stepper.component.scss',
})
export class CredentialOfferStepperComponent implements OnInit{
  @ViewChild('popupCountdown') popupCountdown!: TemplateRef<any>;
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(DialogWrapperService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  //Source actions
  public getInitUrlParams$$ = new Subject<void>();
  public updateIndex$$ = new Subject<StepperIndex>();
  public loadCredentialOfferOnRefreshClick$$ = new Subject<void>();
  
  //Effects
  public updateUrlParamsOnOfferChange = effect(()=> {
    const offer = this.offerParams$();
    this.updateUrlParams(offer);
  });

  //States
  public currentIndex$ = toSignal<StepperIndex>(this.updateIndex$$.pipe(startWith(0 as StepperIndex)));
  public currentStep$ = computed<CredentialOfferStep>(() => {
    return this.currentIndex$() === 0 ? 'onboarding' : 'offer';
  });
  public initUrlParams$: Observable<CredentialOfferParams> = this.getInitUrlParams$$.pipe(
    map(()=>{
      return this.getUrlParams()}
  ));

  public fetchedCredentialOffer$: Observable<Partial<CredentialOfferParamsState>> = 
  merge(
    this.loadCredentialOfferOnRefreshClick$$, 
    this.updateIndex$$.pipe(filter(() => this.currentIndex$() === 1)))
  .pipe(
    switchMap(()=>this.getCredentialOffer().pipe(
      map(params => ({...params, loading: false })),
      catchError(error => { 
        console.error(error);
        return of({ 
          loading: false
        })
      }),
      startWith({
        loading: true
      }),
      tap(val => {console.log('fethCred: ') //todo remove
      console.log(val)
})
    )),
    shareReplay()
  );

  public offerParams$: Signal<CredentialOfferParamsState> = toSignal(
    merge(this.initUrlParams$, this.fetchedCredentialOffer$)
    .pipe(
      scan(
        (previousState, nextState) => ({
          ...previousState,
          ...nextState
        }),
        undefinedCredentialOfferParamsState
      )
  ), 
  { initialValue: undefinedCredentialOfferParamsState }); //this is needed because the seed value in scan() is not emitted

  public stepperOrientation$ = toSignal(this.breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical'))),
  {
    initialValue: 'horizontal'
  });

  private firstCountdown$ = this.fetchedCredentialOffer$
    .pipe(
      filter(val => val.loading === false),
      switchMap(
        () => timer(6000).pipe( //9 * 1000 * 60
          map(()=>'END'),
          startWith('START'))
    ),
    tap(val=>console.log('first count val: ' + val)));

  public showPopup$ = this.firstCountdown$.pipe(
    //close popup when first countdown restarts
    map(val => {
      if(val === 'START'){
      return false
    }else{
      return true 
    }}),
    tap(val=>console.log('popup show? ' + val)), shareReplay()
  );

  // problema: si fetch dona error, es mostra popup d'error, s'emet load=false i es reinicia el primer countdown
  //potser simplement afegir error a state i fer que si surt error, es pari countdown...?
  //ptoser fer q si hi ha qualsevol error, es tanquen popups i es redirigeix a home

  openRefreshPopup$ = this.showPopup$.pipe(
    filter( val => val === true),
    tap(() => {
      const template = new TemplatePortal(this.popupCountdown, {} as ViewContainerRef);
      this.dialog.openDialogWithCallback({
        title: 'Session timeout',
        message: 'Your session is about to expire. Do you want to continue?',
        template: template,
        confirmationType: 'async',
        status: 'error',
        confirmationLabel: 'Refresh',
        cancelLabel: 'Leave',
        loadingData: undefined,
      }, 
      //after confirmation callback
      () => {
        this.onRefreshCredentialClick(); 
        return EMPTY;
        }, 
        //after cancel callback
      () => {
        console.log('go home after cancel refresh popup')
        // this.redirectToHome();
        return EMPTY;
      }
  )})
  ).subscribe();
  //si clica refresh, simplement es refà el fetch i per tant es tanca el popup
  //falta fer que el botó mostri refresh
  closePopup$ = this.showPopup$.pipe(
    filter( val => val === false),
    tap(() => this.dialog['dialog'].closeAll())
  ).subscribe();

  endSessionTime = 3;
  public endSessionCountdown$ = this.showPopup$.pipe(
    // quan s'obre popup, comença compte enrere; quan es tanca, completa
    switchMap(isPopupOpen => {
      if(isPopupOpen){
        return interval(1000).pipe(
          take(this.endSessionTime + 1),
          map(time=>this.endSessionTime - time),
          tap(val => console.log(val))
        ) //1 minut (* 60)
      }else{
        return EMPTY;
      }
    }), shareReplay()
  )

  // en completar compte enrere, es navega a home
  private navigateHomeAfterEndSessionEffect = this.endSessionCountdown$.pipe(
    tap(val=>console.log('navigate after? time = ' + val)),
    filter(time => time === 0),
    tap(()=> console.log('home')),
    tap(()=>this.router.navigate(['/home']))
  );

  public ngOnInit(): void {
    this.getInitUrlParams$$.next();
    this.navigateHomeAfterEndSessionEffect.subscribe(()=>console.log('effect!'));
  }

  public onSelectedStepChange(index:number){
    if(((index !== 0) && (index !== 1))){
      console.error('Unexpected index');
    }else if (index !== this.currentIndex$()) {
      this.updateIndex$$.next(index);
    }
  }

  public getUrlParams(): CredentialOfferParamsState{
    const params = this.route.snapshot.queryParams;
    const transactionCodeParam = params['transaction_code'];
    const cCodeParam = params['c'];

    if(!transactionCodeParam){
      console.error("Client error: Missing transaction code in the URL. Can't get credential offer.");
      
      this.translate.get("error.credentialOffer.invalid-url")
      .pipe(take(1))
      .subscribe((message:string)=>{
        this.dialog.openErrorInfoDialog(message);
        this.redirectToHome();
        }
      );
    }
    const updatedParams: CredentialOfferParamsState = {
      credential_offer_uri: undefined,
      transaction_code: transactionCodeParam,
      c_transaction_code: cCodeParam,
      loading: false
    };
    return updatedParams;
  }

  public getCredentialOffer(): Observable<Partial<CredentialOfferParams>>{
    const offer = this.offerParams$();
    let params: Observable<Partial<CredentialOfferParams>> = throwError(()=>new Error('No transaction nor c code to fetch credential offer.'));
    
    params = of({
      credential_offer_uri: 'uri',
      transaction_code: 'trans',
      c_transaction_code: 'ccccc',
    });
    console.log('getting mock cred')
    //todo if(offer?.c_transaction_code){
    //   params = this.getCredentialOfferByCTransactionCode(offer.c_transaction_code);
    // }else if(offer?.transaction_code){
    //   params = this.getCredentialOfferByTransactionCode(offer.transaction_code);
    // }else{
    //   this.redirectToHome();
    //   console.error("Client error: Transaction code not found. Can't get credential offer");
    //   const message = this.translate.instant("error.credentialOffer.invalid-url");
    //   this.dialog.openErrorInfoDialog(message);
    // }
    return params;
  }

  public getCredentialOfferByTransactionCode(transactionCode:string): Observable<CredentialOfferResponse> {
    if(!transactionCode){
      console.error("No transaction code was found, can't refresh QR.");
      const message = this.translate.instant("error.credentialOffer.invalid-url");
      this.dialog.openErrorInfoDialog(message);
      this.redirectToHome();
      return throwError(()=>new Error());
    }

    return this.credentialProcedureService.getCredentialOfferByTransactionCode(transactionCode)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
          const errorStatus = error?.status || error?.error?.status || 0;
          let errorMessage = this.translate.instant("error.credentialOffer.unexpected");
          
          if (errorStatus === 404) {
            //when credential is downloaded or expired
            errorMessage = this.translate.instant("error.credentialOffer.expired");
          }
          this.dialog.openErrorInfoDialog(errorMessage);
          this.redirectToHome();
          
          return throwError(()=>error);
      })
    )
  }

  public getCredentialOfferByCTransactionCode(cCode:string): Observable<CredentialOfferResponse> {
    if (!cCode) {
      console.error("No c-transaction code was found, can't refresh QR.");
      const message = this.translate.instant("error.credentialOffer.invalid-url");
      this.dialog.openErrorInfoDialog(message);
      this.redirectToHome();
      return throwError(()=>new Error());
    }
  
    return this.credentialProcedureService.getCredentialOfferByCTransactionCode(cCode)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: HttpErrorResponse) => {
          const errorStatus = error?.status || error?.error?.status || 0;
          let errorMessage = this.translate.instant("error.credentialOffer.unexpected");
          
          switch (errorStatus) {
            case 404://when credential is downloaded or expired
              errorMessage = this.translate.instant("error.credentialOffer.expired");
              break;
            case 409: //when credential is completed and user clicks 'back' and 'next'
              errorMessage = 'The credential has already been obtained.';
              break;
          }
          this.dialog.openErrorInfoDialog(errorMessage);
          this.redirectToHome();
          
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

  public onRefreshCredentialClick(): void{
    this.loadCredentialOfferOnRefreshClick$$.next();
  }

  public redirectToHome(){
    setTimeout(()=>{
      this.router.navigate(['/home']);
    }, 0);
  }

}