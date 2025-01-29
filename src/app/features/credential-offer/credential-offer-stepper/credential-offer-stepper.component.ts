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
import { catchError, EMPTY, filter, interval, map, merge, Observable, of, scan, shareReplay, startWith, Subject, switchMap, take, takeUntil, tap, throwError, timer } from 'rxjs';
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

  //REFRESH-SESSION RELATED CONSTANTS
  const START = 'START' as const;
  const END = 'END' as const;
  //todo env variables?
  //time before refresh offer popup is shown
  //it should be less than in the backend, for the time lost in fetching
  const mainSessionTime = 6 * 1000; //in miliseconds
  //countdown for the refresh offer popup; when it comes to 0, redirects to home
  const endSessionTime = 10; //in seconds

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
  public updateUrlParamsOnOfferChangeEffect = effect(()=> {
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

  //EXPIRATION OFFER STREAMS

  //when this startOrEndFirstCountdown$ emits 'START', refresh popup is closed and the endsession countdown starts
  //when it emits 'END', the popup is closed and the countdown is interrupted
  //if user clicks to refresh session, new offer params are fetched, which makes restart the previous flow
  //if there is an error when refreshing session, user is redirected to home
  //if user clicks to leave session, user is redirected to home
  private startOrEndFirstCountdown$: Observable<'START' | 'END'> = this.fetchedCredentialOffer$
  .pipe(
    filter(val => val.loading === false),
    switchMap((): Observable<'START' | 'END'> => 
      timer(mainSessionTime).pipe(
        map(() => END),
        startWith(START)
      )
    ),
    shareReplay()
  );

  private openRefreshPopupEffect = this.startOrEndFirstCountdown$.pipe(
    filter( val => val === 'END'),
    tap(() => {
      const template = new TemplatePortal(this.popupCountdown, {} as ViewContainerRef);
      this.dialog.openDialogWithCallback({
        title: 'Session timeout',
        message: '',
        template: template,
        confirmationType: 'async',
        status: 'default', //error?
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
        this.redirectToHome();
        return EMPTY;
      }
  )})
  );

  private closeRefreshPopupEffect = this.startOrEndFirstCountdown$.pipe(
    filter( val => val === START),
    tap(() => {
      this.dialog['dialog'].closeAll();
    })
  );

  public endSessionCountdown$ = this.startOrEndFirstCountdown$.pipe(
    switchMap(startOrEnd => {
      if(startOrEnd === END){
        return interval(1000).pipe(
          take(endSessionTime + 1),
          map(time=>endSessionTime - time)
        )
      }else{
        return of(endSessionTime);
      }
    }), 
    shareReplay()
  )

  // en completar compte enrere, es navega a home
  private navigateHomeAfterEndSessionEffect = this.endSessionCountdown$.pipe(
    filter(time => time === 0),
    tap(()=>{
      console.info('Offer lifespan expired. Redirect to home.');
      this.dialog['dialog'].closeAll();
      const errorMessage = this.translate.instant("error.credentialOffer.expired");
      this.dialog.openErrorInfoDialog(errorMessage);
      this.redirectToHome();
    })
  );

  public ngOnInit(): void {
    this.getInitUrlParams$$.next();
    
    merge(
      this.openRefreshPopupEffect,
      this.closeRefreshPopupEffect,
      this.navigateHomeAfterEndSessionEffect
    )
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe();
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
    
    if(offer?.c_transaction_code){
      params = this.getCredentialOfferByCTransactionCode(offer.c_transaction_code);
    }else if(offer?.transaction_code){
      params = this.getCredentialOfferByTransactionCode(offer.transaction_code);
    }else{
      this.redirectToHome();
      console.error("Client error: Transaction code not found. Can't get credential offer");
      const message = this.translate.instant("error.credentialOffer.invalid-url");
      this.dialog.openErrorInfoDialog(message);
    }
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