import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PowersComponent } from '../powers/powers.component'; // actualitza la ruta si cal

@Component({
  selector: 'app-credential-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PowersComponent],
  templateUrl: './credential-form.component.html',
})
export class CredentialFormComponent {
  form: FormGroup;
  initialPowers = signal([
    { name: 'onboarding', functions: ['login'] },
    { name: 'productOffering', functions: ['delete'] }
  ]);

  ngOnInit(){
    console.log('update powers')
    this.form.get('powers')?.setValue(this.initialPowers());
    this.form.get('powers')?.updateValueAndValidity();
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      info1: this.fb.group({
        field1: ['', [Validators.required]] // pot tenir validators si vols
      }),
      info2: this.fb.group({
        field2: ['', [Validators.required]] // pot tenir validators si vols
      }),
      powers: [[]] // aquest es vincula amb PowersComponent
    });
  }

  setInitialValue(value: any[]): void {
    console.log('setInitialValue', value);
    // set initial value for all the form
    
  }

  submit() {
    if(this.form.invalid) {
      console.log('Form is invalid');
      return;
    }
    console.log(this.form.value);
  }
}
