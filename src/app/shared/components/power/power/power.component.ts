import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface TempPower {
  tmf_action: string | string[];
  tmf_domain: string;
  tmf_function: string;
  tmf_type: string;
  execute: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  upload: boolean;
  attest: boolean;
}

@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.scss']
})
export class PowerComponent{
  @Input() public isDisabled: boolean = false;
  @Input() public viewMode: 'create' | 'detail' = 'create';
  public _power: TempPower[] = [];
  public get power(){
    return this._power;
  }
  @Input() 
  public set power(value:TempPower[]){
    this._power = value.filter(option =>
      ['Onboarding', 'ProductOffering', 'Certification'].includes(option.tmf_function)
    );
  }
  @Input() public addedOptions: TempPower[] = [];
  @Output() public addedOptionsChange = new EventEmitter<TempPower[]>();
  @Output() public selectedOptionChange = new EventEmitter<string>();
  @Output() public handleSelectChange = new EventEmitter<Event>();

  public selectedOption: string = '';
  public popupMessage: string = '';
  public isPopupVisible: boolean = false;

  public addOption(): void {
    if (this.isDisabled) return;

    if (this.addedOptions.some((option) => option.tmf_function === this.selectedOption)) {
      this.showPopup('This option has already been added.');
      return;
    }
    if (!this.selectedOption) {
      this.showPopup('Please select an option.');
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

  public onHandleSelectChange(event: Event): void {
    this.handleSelectChange.emit(event);
  }

  private showPopup(message: string): void {
    this.popupMessage = message;
    this.isPopupVisible = true;
  }
}
