import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export type BuiltInValidatorEntry = { name: BuiltinValidatorName; args?: any[] };
export type CustomValidatorEntry = { name: CustomValidatorName; args?: any[] };
export type ValidatorEntry = BuiltInValidatorEntry | CustomValidatorEntry;

export class CustomValidators {

  public static isDomain(): ValidatorFn {
    const domainRegex =
      /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (typeof value !== 'string') return { isDomain: 'Value must be a string' };
      return domainRegex.test(value) ? null : { isDomain: 'Invalid domain format' };
    };
  }

  public static isIP(): ValidatorFn {
    const ipv4 =
      /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
    const ipv6 =
      /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|::1)$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (typeof value !== 'string') return { isIP: 'Value must be a string' };
      return ipv4.test(value) || ipv6.test(value) ? null : { isIP: 'Invalid IP format' };
    };
  }
}

export const CUSTOM_VALIDATORS_FACTORY_MAP: Record<
  string,
  (...args: any[]) => ValidatorFn
> = {
  isDomain: CustomValidators.isDomain,
  isIP: CustomValidators.isIP,
} as const;

export type CustomValidatorName = keyof typeof CUSTOM_VALIDATORS_FACTORY_MAP;


export const BUILTIN_VALIDATORS_FACTORY_MAP: Record<
  string,
  (...args: any[]) => ValidatorFn
> = {
  required: () => Validators.required,
  email: () => Validators.email,
  min: (min: number) => Validators.min(min),
  max: (max: number) => Validators.max(max),
  minLength: (minLength: number) => Validators.minLength(minLength),
  maxLength: (maxLength: number) => Validators.maxLength(maxLength),
};

export const ALL_VALIDATORS_FACTORY_MAP: Record<
  BuiltinValidatorName | CustomValidatorName,
  (...args: any[]) => ValidatorFn
> = {
  ...BUILTIN_VALIDATORS_FACTORY_MAP,
  ...CUSTOM_VALIDATORS_FACTORY_MAP,
};


export type BuiltinValidatorName = keyof typeof BUILTIN_VALIDATORS_FACTORY_MAP;