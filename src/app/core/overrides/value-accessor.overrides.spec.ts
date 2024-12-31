import { DefaultValueAccessor } from '@angular/forms';
import { overrideDefaultValueAccessor } from './value-accessor.overrides';

describe('overrideDefaultValueAccessor', () => {
  let mockFn: jest.Mock;

  beforeAll(() => {
    overrideDefaultValueAccessor();
  });

  beforeEach(() => {
    mockFn = jest.fn();
  });

  it('should trim whitespace and replace double spaces with single spaces', () => {
    const defaultValueAccessor = new DefaultValueAccessor({} as any, {} as any, {} as any);
    
    defaultValueAccessor.registerOnChange(mockFn);

    const inputValue = '  Hello   world!  ';
    const expectedValue = 'Hello world!';

    (defaultValueAccessor as any).onChange(inputValue);

    expect(mockFn).toHaveBeenCalledWith(expectedValue);
  });

  it('should pass through non-string values unchanged', () => {
    const defaultValueAccessor = new DefaultValueAccessor({} as any, {} as any, {} as any);
    
    defaultValueAccessor.registerOnChange(mockFn);

    const inputValue = 42;

    (defaultValueAccessor as any).onChange(inputValue);

    expect(mockFn).toHaveBeenCalledWith(inputValue);
  });

  it('should handle null or undefined values gracefully', () => {
    const defaultValueAccessor = new DefaultValueAccessor({} as any, {} as any, {} as any);
    
    defaultValueAccessor.registerOnChange(mockFn);

    (defaultValueAccessor as any).onChange(null);
    expect(mockFn).toHaveBeenCalledWith(null);

    (defaultValueAccessor as any).onChange(undefined);
    expect(mockFn).toHaveBeenCalledWith(undefined);
  });
});