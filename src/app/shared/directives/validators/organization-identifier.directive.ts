import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appOrganizationIdentifierValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: OrganizationIdentifierValidatorDirective,
      multi: true,
    },
  ],
})
export class OrganizationIdentifierValidatorDirective implements Validator {
  public validate(control: AbstractControl): ValidationErrors | null {
    const pattern = /^[a-zA-Z0-9]+$/;
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.startsWith('VAT')) {
      return { startsWithVAT: true };
    }

    const isValid = pattern.test(value);
    return isValid ? null : { invalidIdentifier: true };
  }
}
