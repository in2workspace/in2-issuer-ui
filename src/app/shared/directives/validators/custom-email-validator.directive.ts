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
   *   - Allows maximum 64 characters [this is validated outside the regex].
   * - `domain` (after @):
   *   - Allows letters, numbers, and hyphens (-).
   *   - Requires at least two characters in the main domain (e.g., "aa@a.com" is invalid).
   *   - Requires at least two characters in the top-level domain (e.g., "aa@aa.c" is invalid) [this is validated outside the regex]
   *   - Allows maximum 255 characters [this is validated outside the regex]
   */
  private readonly emailPattern = 
  /^[a-zA-Z0-9](?:[a-zA-Z0-9+_-]|(?:\.[a-zA-Z0-9+_-]))*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]+$/;


  public validate(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
  
    if (!email || typeof email !== 'string') {
      return null;
    }
  
    if (!this.emailPattern.test(email)) {
      return { emailPatternInvalid: true };
    }
  
    const [localPart, domain] = email.split('@');

    if (localPart.length > 64) {
      return { emailLocalPartTooLong: true };
    }

    if (domain.length > 255) {
      return { emailDomainTooLong: true };
    }
  
    const domainParts = domain.split('.');
  
    const mainDomain = domainParts.slice(0, -1).join('.');
    if (mainDomain.length < 2) {
      return { emailMainDomainTooShort: true };
    }
  
    const topLevelDomain = domainParts[domainParts.length - 1];
    if (topLevelDomain.length < 2) {
      return { emailTopLevelDomainTooShort: true };
    }
  
    return null; 
  }
  
}