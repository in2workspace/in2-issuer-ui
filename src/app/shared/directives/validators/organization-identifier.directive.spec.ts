import { OrganizationIdentifierValidatorDirective } from "./organization-identifier.directive";
import { FormControl } from '@angular/forms';

describe('OrganizationIdentifierValidatorDirective', () => {
  let directive: OrganizationIdentifierValidatorDirective;

  beforeEach(() => {
    directive = new OrganizationIdentifierValidatorDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should return null for valid identifiers', () => {
    const control = new FormControl('ABC123');
    const result = directive.validate(control);
    expect(result).toBeNull();
  });

  it('should return null for empty value', () => {
    const control = new FormControl('');
    const result = directive.validate(control);
    expect(result).toBeNull();
  });

  it('should return an error for values starting with "VAT"', () => {
    const control = new FormControl('VAT1234');
    const result = directive.validate(control);
    expect(result).toEqual({ startsWithVAT: true });
  });

  it('should return an error for invalid identifiers', () => {
    const control = new FormControl('INVALID#');
    const result = directive.validate(control);
    expect(result).toEqual({ invalidIdentifier: true });
  });

  it('should be case insensitive for the "VAT" check', () => {
    const control = new FormControl('vat987');
    const result = directive.validate(control);
    expect(result).toEqual({ startsWithVAT: true });
  });
});
