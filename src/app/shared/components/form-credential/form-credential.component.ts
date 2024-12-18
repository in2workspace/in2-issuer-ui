import { Component, DestroyRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, NgModel, FormsModule } from '@angular/forms';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { Country, CountryService } from './services/country.service';
import { FormCredentialService } from './services/form-credential.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ErrorStateMatcher, MatOption } from '@angular/material/core';
import { TempPower } from "../../../core/models/temporal/temp-power.interface";
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Observable, Observer } from 'rxjs';
import { Mandatee, OrganizationDetails, Power } from 'src/app/core/models/entity/lear-credential-employee.entity';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { PowerComponent } from '../power/power.component';
import { OrganizationIdentifierValidatorDirective } from '../../directives/validators/organization-identifier.directive';
import { OrganizationNameValidatorDirective } from '../../directives/validators/organization-name.validator.directive';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { CustomEmailValidatorDirective } from '../../directives/validators/custom-email-validator.directive';
import { NgIf, NgStyle, NgFor, NgTemplateOutlet } from '@angular/common';
import { MaxLengthDirective } from '../../directives/validators/max-length-directive.directive';
import { UnicodeValidatorDirective } from '../../directives/validators/unicode-validator.directive';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError, MatPrefix } from '@angular/material/form-field';
import { MatCard, MatCardContent } from '@angular/material/card';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent, DialogData } from '../dialog/dialog.component';

@Component({
    selector: 'app-form-credential',
    templateUrl: './form-credential.component.html',
    styleUrls: ['./form-credential.component.scss'],
    standalone: true,
    imports: [
        NavbarComponent,
        MatCard,
        MatCardContent,
        FormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        UnicodeValidatorDirective,
        MaxLengthDirective,
        NgIf,
        MatError,
        CustomEmailValidatorDirective,
        NgStyle,
        MatSelect,
        MatSelectTrigger,
        MatOption,
        NgFor,
        MatPrefix,
        OrganizationNameValidatorDirective,
        OrganizationIdentifierValidatorDirective,
        PowerComponent,
        MatButton,
        RouterLink,
        NgTemplateOutlet,
        TranslatePipe,
    ],
})
export class FormCredentialComponent implements OnInit, OnDestroy {
  @ViewChild('formDirective') public formDirective!: FormGroupDirective;
  @Output() public sendReminder = new EventEmitter<void>();
  @Input() public viewMode: 'create' | 'detail' = 'create';
  @Input() public asSigner: boolean = false;
  @Input() public isDisabled: boolean = false;
  @Input() public title: string = '';
  @Input() public power: Power[] = [];
  @Input() public credentialStatus: string = '';
  @Input() public credential: Mandatee = this.initializeCredential();
  @Input() public mandator: OrganizationDetails = this.initializeOrganizationDetails();
  public signer: OrganizationDetails = this.initializeOrganizationDetails();

  public addedPowers$: Observable<TempPower[]>;

  public tempPowers: TempPower[] = []; //for detail view
  public countries: Country[] = [];
  public selectedMandateeCountryIsoCode: string = '';
  public hasIn2OrganizationId = false;
  public addedMandatorLastName: string = '';

  //if mobile has been introduced and unfocused and there is not country, show error
  public countryErrorMatcher: ErrorStateMatcher = {
    isErrorState: (control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean => {
      const mobilePhoneControl = form?.form.get('mobile_phone');
      return (
        !!this.credential.mobile_phone &&
        (!this.selectedMandateeCountryIsoCode || this.selectedMandateeCountryIsoCode === '') &&
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
  private readonly dialog = inject(MatDialog);

  public constructor(){
    this.countries = this.countryService.getSortedCountries();
    this.addedPowers$ = this.formService.getAddedPowers();
    this.hasIn2OrganizationId = this.authService.hasIn2OrganizationIdentifier();
  }

  public ngOnInit(): void {

    this.authService.getMandator()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(mandator2 => {
      if (mandator2) {
        if(this.viewMode === "create" && !this.asSigner){
          this.mandator = {
            'organizationIdentifier': mandator2.organizationIdentifier,
            'organization': mandator2.organization,
            'commonName':mandator2.commonName,
            'emailAddress':mandator2.emailAddress,
            'serialNumber':mandator2.serialNumber,
            'country':mandator2.country
          }
        }
        this.authService.getSigner()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(signer => {
            this.signer = {
              organizationIdentifier: signer?.organizationIdentifier ?? '',
              organization: signer?.organization ?? '',
              commonName: signer?.commonName ?? '',
              emailAddress: signer?.emailAddress ?? '',
              serialNumber: signer?.serialNumber ?? '',
              country: signer?.country ?? ''
            }
          });
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

  public openDialog(dialogData:DialogData, callback:Partial<Observer<any>>|undefined){
    const dialogRef = this.dialog.open(
      DialogComponent, 
      { data: { ...dialogData } }
    );
    
      dialogRef.afterClosed()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(callback);
  }

  public openSubmitDialog(){
    //todo translate
    const dialogData: DialogData = {
      title: `Create credential`,
      message: `Are you sure you want to create this credential?`,
      isConfirmDialog: true,
      status: 'default'
    };
    const callbackAfterDialogClose:Partial<Observer<any>> = {
      next: (result: boolean) => {
        if (result) {
          this.submitCredential();
        }
      }
    };

    this.openDialog(dialogData, callbackAfterDialogClose);
  }

  public submitCredential(): void {
    //optional
    const selectedMandateeCountry: Country|undefined = this.countryService.getCountryFromIsoCode(this.selectedMandateeCountryIsoCode);
    //mandatory if asSigner
    let selectedMandatorCountry: Country|undefined = undefined;
    if(this.asSigner){
      selectedMandatorCountry = this.countryService.getCountryFromName(this.mandator.country);
    }

    //this condition is already applied in the template, so maybe it should be removed
    if (this.hasSelectedPower() && this.selectedPowersHaveFunction()) {
      this.formService
        .submitCredential(
          this.credential,
          selectedMandateeCountry,
          selectedMandatorCountry,
          this.formService.getPlainAddedPowers(),
          this.mandator,
          this.addedMandatorLastName,
          this.signer,
          this.credentialProcedureService,
          this.resetForm.bind(this)
        )
        .subscribe({
          next: () => {
            //todo translate
            const dialogData: DialogData = {
                title: `Credential created`,
                message: this.translate.instant("credentialIssuance.success"),
                isConfirmDialog: false,
                status: `default`
            }
            const callbackAfterDialogClose = {
              next: ()=>{
                this.router.navigate(['/organization/credentials']).then(() => {
                  window.scrollTo(0, 0);
                  location.reload(); 
                });
              }
            }
            this.openDialog(dialogData, callbackAfterDialogClose);
          },
          error: (err:Error) => {
            //server-error-interceptor acts here
            console.error(err);
          }
        });
    } else {
      console.error('Data to submit is not valid');
      return;
    }
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
        this.signer = {
          'organizationIdentifier': mandator2.organizationIdentifier,
          'organization': mandator2.organization,
          'commonName':mandator2.commonName,
          'emailAddress':mandator2.emailAddress,
          'serialNumber':mandator2.serialNumber,
          'country':mandator2.country
        }
      }
    });
  }

   //functions that are used in template; it may be better to avoid executing them in template
  public getCountryNameFromIsoCode(code: string): string {
    return this.countryService.getCountryNameFromIsoCountryCode(code);
  }
  public getCountryPhoneFromIsoCountryCode(code: string): string {
    return this.countryService.getCountryPhoneFromIsoCountryCode(code);
  }

  public hasSelectedPower(): boolean{
    return this.formService.hasSelectedPower();
  }

  public selectedPowersHaveFunction(): boolean {
    return this.formService.powersHaveFunction();
  }

  public showReminderButton(): boolean{
    // todo state WITHDRAWN is temporary, this reference shall be removed when there are no more VCs with this state
    return (this.viewMode === 'detail') && ((this.credentialStatus === 'WITHDRAWN') || (this.credentialStatus === 'DRAFT') || (this.credentialStatus === 'PEND_DOWNLOAD'))
  }

  public ngOnDestroy(): void {
    this.formService.reset();
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
  }

}
