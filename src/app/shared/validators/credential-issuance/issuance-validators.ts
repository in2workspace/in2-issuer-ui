import { BUILTIN_VALIDATORS_FACTORY_MAP, BuiltInValidatorEntry, BuiltinValidatorName } from "./issuance-wrapped-built-in-validators";
import { CUSTOM_VALIDATORS_FACTORY_MAP, CustomValidatorEntry, CustomValidatorName } from "./issuance-custom-validators";
import { ValidatorFn } from "@angular/forms";


export type ValidatorEntry = BuiltInValidatorEntry | CustomValidatorEntry;
export const ALL_VALIDATORS_FACTORY_MAP: Record<
  BuiltinValidatorName | CustomValidatorName,
  (...args: any[]) => ValidatorFn
> = {
  ...BUILTIN_VALIDATORS_FACTORY_MAP,
  ...CUSTOM_VALIDATORS_FACTORY_MAP,
};