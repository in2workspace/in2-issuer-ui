import { AbstractControl, FormArray, ValidationErrors } from '@angular/forms';

export function atLeastOneFunctionSelectedValidator(control: AbstractControl): ValidationErrors | null {
  const formArray = control as FormArray;

  const valid = formArray.length > 0 && formArray.controls.every(group => {
    return Object.values(group.value).some(val => val === true);
  });

  return valid ? null : { invalid: true };
}
