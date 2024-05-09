import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CredentialMandatee } from 'src/app/core/models/credendentialMandatee.interface';
import { CredentialManagement } from 'src/app/core/models/credentialManagement.interface';
import { Mandator } from 'src/app/core/models/madator.interface';
import { Power } from 'src/app/core/models/power.interface';
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
  @Input() public powers: Power[] = [];
  @Input() public credential: CredentialMandatee = {
    id: '',
    firstname: '',
    lastname: '',
    emailaddress: '',
    mobilephone: '',
  };

  public selectedOption = '';
  public addedOptions: Power[] = [];
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
    return `+${this.selectedCountry} ${this.credential.mobilephone}`;
  }
  public set mobilePhone(value: string) {
    const numberPart = value.replace(`+${this.selectedCountry} `, '').trim();

    this.credential.mobilephone = numberPart;
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

    const newOption: Power = {
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

    const credentialManagement: CredentialManagement = {
      id: 'cred-' + new Date().getTime(),
      status: 'issued',
      name: `${this.credential.firstname} ${this.credential.lastname}`,
      updated: new Date().toISOString().split('T')[0],
      mandatee: this.credential,
      powers: this.addedOptions
    };

    this.credentialService.createCredential(credentialManagement).subscribe({
      next: (credential) => {
        console.log('Credential created', credential);
        this.resetForm();
      },
      error: (error) => {
        this.alertService.showAlert('Error creating credential: ' + error, 'error');
      },
    });
  }


  public triggerSendReminder() {
    this.sendReminder.emit();
  }

  private resetForm() {
    this.credential = { id: '', firstname: '', lastname: '', emailaddress: '', mobilephone: '' };
    this.addedOptions = [];
  }
}
