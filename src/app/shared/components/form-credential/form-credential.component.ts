import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialMandatee } from 'src/app/core/models/credendentialMandatee.interface';
import { CredentialProcedure } from 'src/app/core/models/credentialProcedure.interface';
import { Mandator } from 'src/app/core/models/madator.interface';
import { Power } from 'src/app/core/models/power.interface';
import { AlertService } from 'src/app/core/services/alert.service';
import { CredentialProcedureService } from 'src/app/core/services/credential-procedure.service';

interface TempPower {
  tmf_action: string[];
  tmf_domain: string;
  tmf_function: string;
  tmf_type: string;
  execute: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

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
    first_name: '',
    last_name: '',
    email: '',
    mobile_phone: '',
  };
  @Input() public mandator: Mandator | null = null;
  public selectedOption = '';
  public addedOptions: TempPower[] = [];
  public tempPowers: TempPower[] = [];

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
  public credentialForm!: FormGroup;

  public constructor(
    private credentialProcedureService: CredentialProcedureService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {}

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
      country: ['', Validators.required]
    });

    if (this.viewMode === 'detail') {
      this.tempPowers = this.powers.map(power => this.convertToTempPower(power));
    }
  }

  public convertToTempPower(power: Power): TempPower {
    return {
      tmf_action: power.tmf_action,
      tmf_domain: power.tmf_domain,
      tmf_function: power.tmf_function,
      tmf_type: power.tmf_type,
      execute: power.tmf_action.includes('Execute'),
      create: power.tmf_action.includes('Create'),
      update: power.tmf_action.includes('Update'),
      delete: power.tmf_action.includes('Delete')
    };
  }

  public addOption(): void {
    if (this.isDisabled) return;

    if (this.addedOptions.some((option) => option.tmf_function === this.selectedOption)) {
      alert('This option has already been added.');
      return;
    }
    if (!this.selectedOption) {
      alert('Please select an option.');
      return;
    }

    const newOption: TempPower = {
      tmf_action: [],
      tmf_domain: 'DOME',
      tmf_function: this.selectedOption,
      tmf_type: 'Domain',
      execute: false,
      create: false,
      update: false,
      delete: false,
    };
    this.addedOptions.push(newOption);
    this.selectedOption = '';
  }

  public handleSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedOption = selectElement.value;
  }

  public submitCredential(): void {
    if (this.isDisabled) return;
    this.credential.mobile_phone = `+${this.selectedCountry} ${this.credential.mobile_phone}`;

    const powers: Power[] = this.addedOptions.map(option => {
      const tmf_action: string[] = [];
      if (option.execute) tmf_action.push('Execute');
      if (option.create) tmf_action.push('Create');
      if (option.update) tmf_action.push('Update');
      if (option.delete) tmf_action.push('Delete');

      return {
        tmf_action,
        tmf_domain: option.tmf_domain,
        tmf_function: option.tmf_function,
        tmf_type: option.tmf_type
      };
    });

    const credentialProcedure: CredentialProcedure = {
      procedure_id: 'proc-' + new Date().getTime(),
      full_name: `${this.credential.first_name} ${this.credential.last_name}`,
      status: 'issued',
      updated: new Date().toISOString().split('T')[0],
      credential: {
        mandatee: this.credential,
        mandator: this.mandator!,
        powers: powers
      }
    };

    this.credentialProcedureService.saveCredentialProcedure(credentialProcedure).subscribe({
      next: () => {
        this.alertService.showAlert('Credential created successfully!', 'success');
        this.resetForm();
      },
      error: (error: any) => {
        this.alertService.showAlert('Error creating credential: ' + error, 'error');
      },
    });
  }

  public triggerSendReminder(): void {
    this.sendReminder.emit();
  }

  private resetForm(): void {
    this.credential = { first_name: '', last_name: '', email: '', mobile_phone: '' };
    this.addedOptions = [];
    this.credentialForm.reset();
  }
}
