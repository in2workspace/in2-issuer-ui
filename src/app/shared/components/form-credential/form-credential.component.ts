import { Component, DestroyRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, NgModel } from '@angular/forms';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { Country, CountryService } from './services/country.service';
import { FormCredentialService } from './services/form-credential.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { PopupComponent } from '../popup/popup.component';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { TempPower } from "../../../core/models/temporal/temp-power.interface";
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Mandatee, OrganizationDetails, Power } from 'src/app/core/models/entity/lear-credential-employee.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form-credential',
  templateUrl: './form-credential.component.html',
  styleUrls: ['./form-credential.component.scss'],
})
export class FormCredentialComponent implements OnInit, OnDestroy {

  @ViewChild(PopupComponent) public popupComponent!: PopupComponent;
  @ViewChild('formDirective') public formDirective!: FormGroupDirective;
  @Output() public sendReminder = new EventEmitter<void>();
  @Input() public viewMode: 'create' | 'detail' = 'create';
  @Input() public asSigner: boolean = false;
  @Input() public isDisabled: boolean = false;
  @Input() public title: string = '';
  @Input() public showButton: boolean = false; //confusing name
  @Input() public hideButton: boolean = true; //confusing name
  @Input() public power: Power[] = [];
  @Input() public credentialStatus: string = '';
  @Input() public credential: Mandatee = this.initializeCredential();
  @Input() public mandator: OrganizationDetails = this.initializeOrganizationDetails();
  public signer: OrganizationDetails = this.initializeOrganizationDetails();

  public addedPowers$: Observable<TempPower[]>;

  public tempPowers: TempPower[] = []; //for detail view
  public countries: Country[] = [];
  public selectedCountryCode: string = '';
  public hasIn2OrganizationId = false;
  public addedMandatorLastName: string = '';

  public popupMessage: string = '';
  public isPopupVisible: boolean = false;

  //if mobile has been introduced and unfocused and there is not country, show error
  public countryErrorMatcher: ErrorStateMatcher = {
    isErrorState: (control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean => {
      const mobilePhoneControl = form?.form.get('mobile_phone');
      return (
        !!this.credential.mobile_phone &&
        (!this.selectedCountryCode || this.selectedCountryCode === '') &&
        ((mobilePhoneControl?.dirty ?? false))
      );
    },
  };

  public readonly translate = inject(TranslateService);
  private readonly credentialProcedureService = inject(CredentialProcedureService);
  private readonly formService = inject(FormCredentialService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly countryService = inject(CountryService);
  private readonly destroyRef = inject(DestroyRef);

  public constructor(){
    this.countries = this.countryService.getSortedCountries();
    this.addedPowers$ = this.formService.getAddedPowers();
    this.hasIn2OrganizationId = this.authService.hasIn2OrganizationIdentifier();
  }

  public ngOnInit(): void {

    this.authService.getMandator().subscribe(mandator2 => {
      if (mandator2) {
        if(this.viewMode === "create" && !this.asSigner){
          this.mandator ={ 'organizationIdentifier': mandator2.organizationIdentifier,
            'organization': mandator2.organization,
            'commonName':mandator2.commonName,
            'emailAddress':mandator2.emailAddress,
            'serialNumber':mandator2.serialNumber,
            'country':mandator2.country}
        }
        this.authService.getSigner().subscribe(signer => {
          this.signer = {
            organizationIdentifier: signer?.organizationIdentifier ?? '',
            organization: signer?.organization ?? '',
            commonName: signer?.commonName ?? '',
            emailAddress: signer?.emailAddress ?? '',
            serialNumber: signer?.serialNumber ?? '',
            country: signer?.country ?? ''
          }
        })
      }
    });

    if (this.viewMode === 'detail') {
      this.tempPowers = this.power.map(power => this.formService.convertToTempPower(power));
    }
  }

  public markPrefixAndPhoneAsTouched(prefixControl: NgModel, phoneControl: NgModel): void {
    if (prefixControl) {
      //so angular material can mark the input as invalid
      prefixControl.control.markAsTouched();
    }
    if (phoneControl) {
      phoneControl.control.markAsDirty();
    }
  }

  public submitCredential(): void {
    //this condition is already applied in the template, so maybe it should be removed
    if (this.hasSelectedPower() && this.selectedPowersHaveFunction()) {
      this.formService
        .submitCredential(
          this.credential,
          this.selectedCountryCode,
          this.formService.getPlainAddedPowers(),
          this.mandator,
          this.addedMandatorLastName,
          this.signer,
          this.credentialProcedureService,
          this.popupComponent,
          this.resetForm.bind(this)
        )
        .subscribe({
          next: () => {
            this.popupMessage = this.translate.instant("credentialIssuance.success");
            this.openTempPopup();
            this.router.navigate(['/organization/credentials']).then(() => {
              window.scrollTo(0, 0);
              location.reload(); 
            });
          },
          error: (err:Error) => {
            this.popupMessage = this.translate.instant("error.credential_submission");
            this.openTempPopup();
            console.error(err);
          }
        });
    } else {
      this.popupMessage = this.translate.instant("error.one_power_min");
      this.openTempPopup();
      return;
    }
  }

  public openTempPopup(){
    this.isPopupVisible = true;
    setTimeout(()=>{this.isPopupVisible=false}, 1000);
  }

  public triggerSendReminder(): void {
    this.sendReminder.emit();
  }

  //this function is currently unused, since user is redirected after successful submit
  public resetForm(): void {
    this.credential = this.formService.resetForm();
    this.formDirective.resetForm();
    this.formService.setAddedPowers([]);
    this.authService.getMandator()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(mandator2 => {
      if (mandator2) {
        this.mandator = mandator2;
        this.signer = { 'organizationIdentifier': mandator2.organizationIdentifier,
                        'organization': mandator2.organization,
                        'commonName':mandator2.commonName,
                        'emailAddress':mandator2.emailAddress,
                        'serialNumber':mandator2.serialNumber,
                        'country':mandator2.country}
      }
    });
  }

  private initializeCredential(): Mandatee {
    return {
      first_name: '',
      last_name: '',
      email: '',
      mobile_phone: ''
    };
  }

  private initializeOrganizationDetails(): OrganizationDetails {
    return {
      organizationIdentifier: '',
      organization: '',
      commonName: '',
      emailAddress: '',
      serialNumber: '',
      country: ''
    };
  }  //functions that are used in template; it may be better to avoid executing them in template
  public getCountryName(code: string): string {
    const country = this.countries.find(c => c.code === code);
    return country ? country.name : '';
  }

  public hasSelectedPower(): boolean{
    return this.formService.hasSelectedPower();
  }

  public selectedPowersHaveFunction(): boolean {
    return this.formService.powersHaveFunction();
  }

  public showReminderButton(): boolean{
    return (this.credentialStatus === 'WITHDRAWN') || (this.credentialStatus === 'PEND_DOWNLOAD')
  }

  public ngOnDestroy(): void {
    this.formService.reset();
  }

}
