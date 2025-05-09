import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', () => {
  let pipe: CapitalizePipe;

  beforeEach(() => {
    pipe = new CapitalizePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should capitalize the first letter of a lowercase word', () => {
    const result = pipe.transform('example');
    expect(result).toBe('Example');
  });

  it('should not change a word that is already capitalized', () => {
    const result = pipe.transform('Example');
    expect(result).toBe('Example');
  });

  it('should handle an empty string', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });

  it('should handle a string with one character', () => {
    const result = pipe.transform('x');
    expect(result).toBe('X');
  });

  it('should return empty string if value is null', () => {
    const result = pipe.transform(null as any);
    expect(result).toBe('');
  });

  it('should return empty string if value is undefined', () => {
    const result = pipe.transform(undefined as any);
    expect(result).toBe('');
  });
});
