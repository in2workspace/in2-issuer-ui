import { Component, Input } from '@angular/core';
import { Option } from 'src/app/core/models/option.interface';

@Component({
  selector: 'app-form-credential',
  templateUrl: './form-credential.component.html',
  styleUrls: ['./form-credential.component.scss'],
})
export class FormCredentialComponent {
  @Input() public isDisabled: boolean = false;
  @Input() public title: string = '';
  @Input() public showButton: boolean = false;

  public selectedOption = '';
  public addedOptions: Option[] = [];

  public addOption() {
    if (this.isDisabled) return;

    if (
      this.addedOptions.find((option) => option.name === this.selectedOption)
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
}
