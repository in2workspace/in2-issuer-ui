import { Component } from '@angular/core';
import { Option } from 'src/app/core/models/option.interface';
@Component({
  selector: 'app-form-lear-credential',
  templateUrl: './form-lear-credential.component.html',
  styleUrls: ['./form-lear-credential.component.scss']
})
export class FormLearCredentialComponent {

  public selectedOption = '';
  public addedOptions: Option[] = [];

  public addOption() {
    if (this.addedOptions.find(option => option.name === this.selectedOption)) {
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
      delete: false
    };
    this.addedOptions.push(newOption);
    this.selectedOption = '';
  }
}
