import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, NgModel, Validators} from '@angular/forms';
import {CredentialMandatee} from 'src/app/core/models/credendentialMandatee.interface';
import {Mandator} from 'src/app/core/models/madator.interface';
import {Power} from 'src/app/core/models/power.interface';
import {CredentialProcedureService} from 'src/app/core/services/credential-procedure.service';
import {TempPower} from '../power/power/power.component';
import {Country, CountryService} from './services/country.service';
import {FormCredentialService} from './services/form-credential.service';
import {AuthService} from 'src/app/core/services/auth.service';
import {PopupComponent} from '../popup/popup.component';
import {Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';

export interface objectWithName{
  name:string
}

@Component({
  selector: 'app-form-credential',
  templateUrl: './form-credential.component.html',
  styleUrls: ['./form-credential.component.scss'],
})
export class FormCredentialComponent implements OnInit {

  @ViewChild(PopupComponent) public popupComponent!: PopupComponent;
  @ViewChild('formDirective') public formDirective!: FormGroupDirective;
  @Output() public sendReminder = new EventEmitter<void>();
  @Input() public viewMode: 'create' | 'detail' = 'create';
  @Input() public isDisabled: boolean = false;
  @Input() public title: string = '';
  @Input() public showButton: boolean = false;
  @Input() public hideButton: boolean = true;
  @Input() public power: Power[] = [];
  @Input() public credentialStatus: string = '';
  @Input() public credential: CredentialMandatee = {
    first_name: '',
    last_name: '',
    email: '',
    mobile_phone: '',
  };
  @Input() public mandator: Mandator = {
    organizationIdentifier: "",
    organization: "",
    commonName: "",
    emailAddress: "",
    serialNumber: "",
    country: "",
  }
  public signer : any ={};

  //if mobile has been introduced and unfocused and there is not country, show error
  public countryErrorMatcher: ErrorStateMatcher = {
    isErrorState: (control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean => {
      const mobilePhoneControl = form?.form.get('mobile_phone');
      return (
        !!this.credential.mobile_phone &&
        (!this.selectedCountryCode || this.selectedCountryCode === '') &&
        ((mobilePhoneControl?.touched ?? false))
      );
    },
  };

  public selectedOption = '';
  public addedOptions: TempPower[] = [];
  public tempPowers: TempPower[] = [];
  public countries: Country[] = [];
  public selectedCountryCode: string = '';
  public actualMobilePhone: string = '';
  public credentialForm!: FormGroup;

  public popupMessage: string = '';
  public isPopupVisible: boolean = false;

  public isValidOrganizationIdentifier = false;
  public showMandator: boolean = false;

  public constructor(
    private credentialProcedureService: CredentialProcedureService,
    private fb: FormBuilder,
    private countryService: CountryService,
    private formCredentialService: FormCredentialService,
    private authService: AuthService,
    private router: Router
  ) {
    this.countries = this.countryService.getSortedCountries();
    this.isValidOrganizationIdentifier = this.authService.hasIn2OrganizationIdentifier()
  }


  public get mobilePhone(): string {
    return `${this.selectedCountryCode} ${this.credential.mobile_phone}`;
  }
  public set mobilePhone(value: string) {
    this.credential.mobile_phone = value.replace(`${this.selectedCountryCode} `, '').trim();
  }

  public markPrefixAndPhoneAsTouched(prefixControl: NgModel, phoneControl: NgModel): void {
    if (prefixControl) {
      prefixControl.control.markAsTouched();
    }
    if (phoneControl) {
      phoneControl.control.markAsTouched();
    }
  }


  public ngOnInit(): void {

    this.formCredentialService.showMandator$.subscribe((value) => {
      this.showMandator = value;
    });

    this.credentialForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      last_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.email]],
      mobile_phone: ['', [Validators.pattern('[0-9 ]*')]],
      country: ['', Validators.required],

    });

    this.authService.getMandator().subscribe(mandator2 => {
      if (mandator2) {
        if(this.viewMode === "create" && !this.showMandator){
          this.mandator ={ 'organizationIdentifier': mandator2.organizationIdentifier,
            'organization': mandator2.organization,
            'commonName':mandator2.commonName,
            'emailAddress':mandator2.emailAddress,
            'serialNumber':mandator2.serialNumber,
            'country':mandator2.country}
        }
        this.signer = { 'organizationIdentifier': mandator2.organizationIdentifier,
                        'organization': mandator2.organization,
                        'commonName':mandator2.commonName,
                        'emailAddress':mandator2.emailAddress,
                        'serialNumber':mandator2.serialNumber,
                        'country':mandator2.country}
      }
    });

    if (this.viewMode === 'detail') {
      this.tempPowers = this.power.map(power => this.formCredentialService.convertToTempPower(power));
    }
  }

  public getCountryName(code: string): string {
    const country = this.countries.find(c => c.code === code);
    return country ? country.name : '';
  }

  public addOption(options: TempPower[]): void {
    this.addedOptions = this.formCredentialService.addOption(this.addedOptions, options, this.isDisabled);
  }

  public handleSelectChange(event: Event): void {
    this.selectedOption = this.formCredentialService.handleSelectChange(event);
  }

  public hasSelectedPowers(): boolean {
    return this.addedOptions.every(option =>
      option.execute || option.create || option.update || option.delete || option.upload
    );
  }

  public showReminderButton(){
    return (this.credentialStatus === 'WITHDRAWN') || (this.credentialStatus === 'PEND_DOWNLOAD')
  }

  public submitCredential(): void {
    console.log('submit')
    if (this.addedOptions.length > 0 && this.hasSelectedPowers()) {
      this.formCredentialService
        .submitCredential(
          this.credential,
          this.selectedCountryCode,
          this.addedOptions,
          this.mandator,
          this.signer,
          this.credentialProcedureService,
          this.popupComponent,
          this.resetForm.bind(this)
        )
        .subscribe({
          next: () => {
            // Navigate after successful submission
            this.router.navigate(['/organization/credentials']).then(() => {
              window.scrollTo(0, 0); // Reset scroll position
              location.reload(); // Refresh the page
            });
          },
          error: (err) => {
            this.popupMessage = 'Error occurred while submitting credential.';
            this.isPopupVisible = true;
            setTimeout(()=>{this.isPopupVisible=false}, 1000)
            console.error(err);
          }
        });
    } else {
      this.popupMessage = 'Each power must have at least one action selected.';
      this.isPopupVisible = true;
      return;
    }
  }

  public triggerSendReminder(): void {
    this.sendReminder.emit();
  }

  private resetForm(): void {
    this.credential = this.formCredentialService.resetForm();
    this.formDirective.resetForm();
    this.addedOptions = [];
    this.credentialForm.reset();
    this.authService.getMandator().subscribe(mandator2 => {
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
}
