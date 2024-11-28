import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appEmailValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CustomEmailValidatorDirective,
      multi: true,
    },
  ],
})
export class CustomEmailValidatorDirective implements Validator {
  private readonly emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/;
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

    if (!this.emailPattern.test(email)) {
      return { emailPatternInvalid: true };
    }

    return null;
  }
}