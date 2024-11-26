import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appUnicodeValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UnicodeValidatorDirective,
      multi: true,
    },
  ],
})
export class UnicodeValidatorDirective implements Validator {
  public validate(control: AbstractControl): ValidationErrors | null {
    const pattern = /^[\p{L}\p{M}'\- .]+$/u;
    const value = control.value;

    if (!value) {
      return null;
    }

    const isValid = pattern.test(value);
    return isValid ? null : { invalidUnicode: true };
  }
}