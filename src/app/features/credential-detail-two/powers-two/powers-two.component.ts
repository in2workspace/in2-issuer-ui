import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PowerInstance } from 'src/app/core/models/details/models-details';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-powers-two',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './powers-two.component.html',
  styleUrl: './powers-two.component.scss'
})
export class PowersTwoComponent {
  @Input() availablePowers: PowerInstance[] = [];
  @Input() powersFormArray!: FormArray; // 🔥 Ara rep un FormArray directament

  selectedPowerName = '';

  constructor(private fb: FormBuilder) {
    
  }

  ngOnInit() {
    console.log('ngOnInit', this.powersFormArray);
  }

  getPowerGroup(index: number): FormGroup {
    const group = this.powersFormArray.at(index) as FormGroup;
    console.log('getPowerGroup', index, group);
    return group as FormGroup;
  }

  // addPower() {
  //   const power = this.availablePowers.find(p => p.name === this.selectedPowerName);
  //   if (power) {
  //     const functionsGroup = this.fb.group({});
  //     power.functions.forEach(fnc => {
  //       functionsGroup.addControl(fnc, new FormControl(false));
  //     });
  //     this.powersFormArray.push(functionsGroup);

  //     this.powersFormArray.updateValueAndValidity();
  //     this.powersFormArray.markAsDirty();
  //     this.selectedPowerName = '';
  //   }
  // }

  addPower() {
    console.log('add power')
    const power = this.availablePowers.find(p => p.name === this.selectedPowerName);
    if (power) {
      const functionsGroup = this.fb.group({});
  
      power.functions.forEach(func => {
        functionsGroup.addControl(func.name, new FormControl(func.value));
      });
  
      this.powersFormArray.push(functionsGroup);
  
      this.powersFormArray.updateValueAndValidity();
      this.powersFormArray.markAsDirty();
      this.selectedPowerName = '';
    }
  }

  getFunctionName(index: number, key: string): string {
    console.log('getFunctionName', index);
    console.log(key);
    const power = this.availablePowers[index];
    if (!power) {
      return key; // fallback
    }
    const func = power.functions.find(f => f.name === key);
    return func ? func.name : key;
  }
}
