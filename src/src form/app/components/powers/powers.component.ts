import { POWER_OPTIONS, PowerOption } from './../../core/models/power';
import { CredentialType } from '../../core/models/credential';
import { Component, computed, inject, input, signal, effect, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { atLeastOneFunctionSelectedValidator } from '../../core/validators/atLeastOneFunctionSelected';

@Component({
  selector: 'app-powers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './powers.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PowersComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PowersComponent,
      multi: true
    }
  ],
})
export class PowersComponent implements ControlValueAccessor, Validators, OnInit {
  private fb = inject(FormBuilder);

  // input signal
  type = input<CredentialType>('employee');

  // initialValue = input<any[] | null>(null);

  // computed
  availablePowers = computed(() => POWER_OPTIONS[this.type()]);
  addedPowers = signal<Set<string>>(new Set());

  // form
  powerForm = this.fb.group({
    selectedPowers: this.fb.array([], [Validators.required, atLeastOneFunctionSelectedValidator])
  });

  ngOnInit() {
      // const value = this.initialValue();
      // console.log('initialValue', value);
      // if (value && value.length > 0) {
      //   this.loadValue(value);
      // }
  }

  private loadValue(value: any[]): void {
    console.log('loadValue', value);
    this.selectedPowers.clear();
    this.addedPowers.set(new Set());
  
    value.forEach((val: any) => {
      const power = this.availablePowers().find(p => p.name === val.name);
      if (power) {
        const group = this.fb.group({});
        power.functions.forEach(fn => {
          group.addControl(fn, this.fb.control(val.functions?.includes(fn) ?? false));
        });
        this.selectedPowers.push(group);
        this.addedPowers.set(new Set(this.addedPowers()).add(power.name));
      }
    });
  }

  get selectedPowers(): FormArray {
    return this.powerForm.get('selectedPowers') as FormArray;
  }

  // ControlValueAccessor
  private onChange = (_: any) => {
    console.log('original onChange', _);
  };
  private onTouched = () => {};

  // El pare passarà valors quan sigui "details view mode"
  writeValue(value: any): void {
    if (Array.isArray(value)) {
      this.loadValue(value);
    }
  }

  registerOnChange(fn: any): void {
    console.log('registerOnChange', fn);
    this.onChange = fn;
    this.powerForm.valueChanges.subscribe(() => {
      const value = this.powerForm.value.selectedPowers;
      console.log('canviem això', value);
      this.onChange(value);
    });
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.powerForm.disable() : this.powerForm.enable();
  }

  // Helpers

  addPowerByName(powerName: string): void {
    const power = this.availablePowers().find(p => p.name === powerName);
    if (power) {
      this.addPower(power);
    }
  }

  addPower(power: PowerOption): void {
    const group = this.fb.group({});
    power.functions.forEach(fn => group.addControl(fn, this.fb.control(false)));
    this.selectedPowers.push(group);
    this.addedPowers.set(new Set(this.addedPowers()).add(power.name));
  }

  get powerIndexes(): number[] {
    return Array.from({ length: this.selectedPowers.length }, (_, i) => i);
  }

  isPowerAdded(powerName: string): boolean {
    return this.addedPowers().has(powerName);
  }

  getPowerGroupAt(i: number): FormGroup {
    return this.selectedPowers.at(i) as FormGroup;
  }

  getPowerFunctionsAt(i: number): string[] {
    const powerName = Array.from(this.addedPowers())[i];
    const power = this.availablePowers().find(p => p.name === powerName);
    return power?.functions || [];
  }

  private getOutputValue(): any {
    // return this.selectedPowers.controls.map((group, index) => {
    //   const powerName = Array.from(this.addedPowers())[index];
    //   const functions = Object.entries(group.value)
    //     .filter(([_, val]) => val === true)
    //     .map(([fn]) => fn);
    //   return { name: powerName, functions };
    // });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.powerForm.valid ? null : { powersInvalid: true };
  }
}
