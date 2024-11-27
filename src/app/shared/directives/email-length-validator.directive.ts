import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appValidateEmailLength]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EmailLengthValidatorDirective,
      multi: true,
    },
  ],
})
export class EmailLengthValidatorDirective implements Validator {
  public validate(control: AbstractControl): ValidationErrors | null {
    const email = control.value;

    if (!email || typeof email !== 'string') {
      return null;
    }

    const [localPart, domain] = email.split('@');

    if (localPart && localPart.length > 64) {
      return { emailLocalPartTooLong: true };
    }

    if (domain && domain.length > 255) {
      return { emailDomainTooLong: true };
    }

    return null;
  }
}