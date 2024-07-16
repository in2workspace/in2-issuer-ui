import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialMandatee } from 'src/app/core/models/credendentialMandatee.interface';
import { Mandator } from 'src/app/core/models/madator.interface';
import { Power } from 'src/app/core/models/power.interface';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';
import { TempPower } from '../power/power/power.component';
import { Country, CountryService } from './services/country.service';
import { FormCredentialService } from './services/form-credential.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-form-credential',
  templateUrl: './form-credential.component.html',
  styleUrls: ['./form-credential.component.scss'],
})
export class FormCredentialComponent implements OnInit {
  @ViewChild(PopupComponent) public popupComponent!: PopupComponent;
  @Output() public sendReminder = new EventEmitter<void>();
  @Input() public viewMode: 'create' | 'detail' = 'create';
  @Input() public isDisabled: boolean = false;
  @Input() public title: string = '';
  @Input() public showButton: boolean = false;
  @Input() public hideButton: boolean = true;
  @Input() public role: string = "";
  @Input() public power: Power[] = [];
  @Input() public credential: CredentialMandatee = {
    first_name: '',
    last_name: '',
    email: '',
    mobile_phone: '',
  };
  public signer : any ={};
  @Input() public mandator: Mandator = {
    organizationIdentifier: "",
    organization: "",
    commonName: "",
    emailAddress: "",
    serialNumber: "",
    country: "",
  }

  public selectedOption = '';
  public addedOptions: TempPower[] = [];
  public tempPowers: TempPower[] = [];
  public countries: Country[] = [];
  public selectedCountry: string = '';
  public actualMobilePhone: string = '';
  public credentialForm!: FormGroup;

  public popupMessage: string = '';
  public isPopupVisible: boolean = false;



  public constructor(
    private credentialProcedureService: CredentialProcedureService,
    private fb: FormBuilder,
    private countryService: CountryService,
    private formCredentialService: FormCredentialService,
    private authService: AuthService
  ) {
    this.countries = this.countryService.getCountries();
  }

  public get mobilePhone(): string {
    return `${this.selectedCountry} ${this.credential.mobile_phone}`;
  }
  public set mobilePhone(value: string) {
    const numberPart = value.replace(`${this.selectedCountry} `, '').trim();
    this.credential.mobile_phone = numberPart;
  }

  public ngOnInit(): void {
    this.credentialForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      last_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.email]],
      mobile_phone: ['', [Validators.required, Validators.pattern('[0-9 ]*')]],
      country: ['', Validators.required],

    });

    this.authService.getMandator().subscribe(mandator2 => {
      if (mandator2) {
        this.mandator ={ 'organizationIdentifier': mandator2.organizationIdentifier,
          'organization': mandator2.organization,
          'commonName':mandator2.commonName,
          'emailAddress':mandator2.emailAddress,
          'serialNumber':mandator2.serialNumber,
          'country':mandator2.country}
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

  public addOption(options: TempPower[]): void {
    this.addedOptions = this.formCredentialService.addOption(this.addedOptions, options, this.isDisabled);
  }

  public handleSelectChange(event: Event): void {
    this.selectedOption = this.formCredentialService.handleSelectChange(event);
  }

  public submitCredential(): void {

      this.formCredentialService.submitCredential(
        this.credential,
        this.selectedCountry,
        this.addedOptions,
        this.mandator,
        this.signer,
        this.credentialProcedureService,
        this.popupComponent,
        this.resetForm.bind(this)
      );
  }

  public triggerSendReminder(): void {
    this.sendReminder.emit();
  }

  private resetForm(): void {
    this.credential = this.formCredentialService.resetForm();
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
