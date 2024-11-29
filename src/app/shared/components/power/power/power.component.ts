import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { AuthService } from "../../../../core/services/auth.service";
import { MatSelectChange } from '@angular/material/select';
import { TempPower } from "../../../../core/models/temporal/temp-power.interface";

@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.scss']
})
export class PowerComponent {
  @Input() public isDisabled: boolean = false;
  @Input() public viewMode: 'create' | 'detail' = 'create';
  @Input() public power: TempPower[] = [];
  @Input() public addedOptions: TempPower[] = [];
  @Output() public addedOptionsChange = new EventEmitter<TempPower[]>();
  @Output() public selectedOptionChange = new EventEmitter<string>();
  @Output() public handleSelectChange = new EventEmitter<Event>();

  public selectedOption: string = '';
  public popupMessage: string = '';
  public isPopupVisible: boolean = false;
  public organizationIdentifierIsIn2: boolean = false;

  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.organizationIdentifierIsIn2 = this.authService.hasIn2OrganizationIdentifier();
  }

  public addOption(): void {
    if (this.isDisabled) return;

    // if (this.addedOptions.some((option) => option.tmf_function === this.selectedOption)) {
    //   this.showPopup('This option has already been added.');
    //   return;
    // }
    if (!this.selectedOption) {
      this.showPopup('Please select an option.');
      return;
    }

    if (this.selectedOption === 'Onboarding' && !this.organizationIdentifierIsIn2) {
      return;
    }

    if (this.selectedOption === 'Certification' && !this.organizationIdentifierIsIn2) {
      return;
    }

    const newOption: TempPower = {
      tmf_action: '',
      tmf_domain: 'DOME',
      tmf_function: this.selectedOption,
      tmf_type: 'Domain',
      execute: false,
      create: false,
      update: false,
      delete: false,
      upload: false,
      attest: false
    };

    switch(this.selectedOption) {
      case 'Certification':
        newOption.upload = false;
        newOption.attest = false;
        break;
      case 'ProductOffering':
        newOption.create = false;
        newOption.update = false;
        newOption.delete = false;
        break;
      case 'Onboarding':
        newOption.execute = false;
        break;
      default:
        break;
    }

    this.addedOptions.push(newOption);
    this.addedOptionsChange.emit(this.addedOptions);
    this.selectedOption = '';
  }

  public removeOption(optionToRemove: string): void {
    this.addedOptions = this.addedOptions.filter(
      (option) => option.tmf_function !== optionToRemove
    );
  
    this.addedOptionsChange.emit(this.addedOptions);
  }

  public onHandleSelectChange(event: MatSelectChange): void {
    this.handleSelectChange.emit(event.value);
  }

  public isOptionDisabled(option: string): boolean {
    return this.addedOptions.some((addedOption) => addedOption.tmf_function === option);
  }

  private showPopup(message: string): void {
    this.popupMessage = message;
    this.isPopupVisible = true;
    setTimeout(()=>{
      this.isPopupVisible=false
    }, 1000);
  }

}
