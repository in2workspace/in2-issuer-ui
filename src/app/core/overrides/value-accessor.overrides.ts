import { DefaultValueAccessor } from '@angular/forms';

//trims and deletes double spaces from values received in inputs
export function overrideDefaultValueAccessor(): void {
  function isString(value: any): boolean {
    return typeof value === 'string';
  }

  const original = DefaultValueAccessor.prototype.registerOnChange;

  DefaultValueAccessor.prototype.registerOnChange = function (fn) {
    return original.call(this, value => {
      const trimmed = isString(value) ? value.trim().replace(/ {2,}/g, ' ') : value;
      return fn(trimmed);
    });
  };
}