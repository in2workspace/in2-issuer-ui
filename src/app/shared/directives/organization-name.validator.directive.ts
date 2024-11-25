import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appOrgNameValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: OrganizationNameValidatorDirective,
      multi: true,
    },
  ],
})
export class OrganizationNameValidatorDirective implements Validator {
  public validate(control: AbstractControl): ValidationErrors | null {
    const pattern = /^[\p{L}\p{M}0-9'&\-,.()/ ]+$/u;
    const value = control.value;

    if (!value) {
      return null;
    }

    const isValid = pattern.test(value);
    return isValid ? null : { invalidOrgName: true };
  }
}