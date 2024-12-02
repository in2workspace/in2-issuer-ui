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
  /**
   * Validates email addresses according to RFC 5322, excluding quoted strings (e.g., "john..doe"@example.com).
   * 
   * Rules:
   * - `local-part` (before @):
   *   - Allows letters, numbers, and special characters: !#$%&'*+/=?^_`{|}~-.
   *   - Permits dots (.) only between segments (not at start, end, or consecutively).
   * - `domain` (after @):
   *   - Allows letters, numbers, and hyphens (-).
   *   - Hyphens cannot appear at the start or end of a segment.
   *   - Requires at least two characters in the top-level domain (e.g., ".com").
   */
  private readonly emailPattern =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]{2,}(?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

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