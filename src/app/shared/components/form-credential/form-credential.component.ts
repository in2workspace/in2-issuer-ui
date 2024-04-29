import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CredentialMandatee } from 'src/app/core/models/credendentialMandatee.interface';
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
  @Input() public credential: CredentialMandatee = {
    id: '',
    firstname: '',
    lastname: '',
    emailaddress: '',
    mobilephone: '',
    options: [],
  };

  public selectedOption = '';
  public addedOptions: Option[] = [];
  public mandator: Mandator | null = null;

  public constructor(
    private credentialService: CredentialissuanceService,
    private mandatorService: MandatorService,
    private alertService: AlertService
  ) {}
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

    this.credential.id = 'cred-' + new Date().getTime();

    this.credential.options = this.addedOptions;
    this.credentialService.createCredential(this.credential).subscribe({
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
    this.credential = {
      id: '',
      firstname: '',
      lastname: '',
      emailaddress: '',
      mobilephone: '',
      options: [],
    };
    this.addedOptions = [];
    this.selectedOption = '';
  }
}
