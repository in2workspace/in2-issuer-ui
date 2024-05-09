import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mandatee } from 'src/app/core/models/mandatee.interface';
import { Mandator } from 'src/app/core/models/madator.interface';
import { Option } from 'src/app/core/models/option.interface';
import { AlertService } from 'src/app/core/services/alert.service';
import { CredentialissuanceService } from 'src/app/core/services/credentialissuance.service';
import { MandatorService } from 'src/app/core/services/mandator.service';

@Component({
  selector: 'app-form-credential',
  templateUrl: './form-credential.component.html',
  styleUrls: ['./form-credential.component.scss'],
})
export class FormCredentialComponent implements OnInit {
  @Output() public sendReminder = new EventEmitter<void>();
  @Input() public viewMode: 'create' | 'detail' = 'create';
  @Input() public isDisabled: boolean = false;
  @Input() public title: string = '';
  @Input() public showButton: boolean = false;
  @Input() public hideButton: boolean = true;
  @Input() public credential: Mandatee = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile_phone: '',
    options: [],
  };

  public selectedOption = '';
  public addedOptions: Option[] = [];
  public mandator: Mandator | null = null;

  public countries = [
    { name: 'Spain', code: '34' },
    { name: 'Germany', code: '49' },
    { name: 'France', code: '33' },
    { name: 'Italy', code: '39' },
    { name: 'United Kingdom', code: '44' },
    { name: 'Russia', code: '7' },
    { name: 'Ukraine', code: '380' },
    { name: 'Poland', code: '48' },
    { name: 'Romania', code: '40' },
    { name: 'Netherlands', code: '31' },
    { name: 'Belgium', code: '32' },
    { name: 'Greece', code: '30' },
    { name: 'Portugal', code: '351' },
    { name: 'Sweden', code: '46' },
    { name: 'Norway', code: '47' },
  ];
  public selectedCountry: string = '';
  public actualMobilePhone: string = '';

  public constructor(
    private credentialService: CredentialissuanceService,
    private mandatorService: MandatorService,
    private alertService: AlertService
  ) {}

  public get mobilePhone(): string {
    return `+${this.selectedCountry} ${this.credential.mobile_phone}`;
  }
  public set mobilePhone(value: string) {
    const numberPart = value.replace(`+${this.selectedCountry} `, '').trim();

    this.credential.mobile_phone = numberPart;
  }
  public ngOnInit(): void {
    this.mandatorService.getMandator().subscribe((mandator) => {
      this.mandator = mandator;
    });
  }

  public addOption() {
    if (this.isDisabled) return;

    if (
      this.addedOptions.some((option) => option.name === this.selectedOption)
    ) {
      alert('This option has already been added.');
      return;
    }
    if (!this.selectedOption) {
      alert('Please select an option.');
      return;
    }

    const newOption: Option = {
      name: this.selectedOption,
      execute: false,
      create: false,
      update: false,
      delete: false,
    };
    this.addedOptions.push(newOption);
    this.selectedOption = '';
  }

  public submitCredential() {
    if (this.isDisabled) return;

    this.credential.mobile_phone = `${this.selectedCountry} ${this.credential.mobile_phone}`;

    this.credential.id = 'cred-' + new Date().getTime();
    this.credential.options = this.addedOptions;
    this.credentialService.createCredential(this.credential).subscribe({
      next: (credential) => {
        console.log('Credential created', credential);
        this.resetForm();
      },
      error: (error) => {
        this.alertService.showAlert(
          'Error creating credential: ' + error,
          'error'
        );
      },
    });
  }

  public triggerSendReminder() {
    this.sendReminder.emit();
  }

  private resetForm() {
    this.credential = {
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      mobile_phone: '',
      options: [],
    };
    this.addedOptions = [];
    this.selectedOption = '';
  }
}
