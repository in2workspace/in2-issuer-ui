import { AddPrefixPipe } from './add-prefix.pipe';

describe('AddPrefixPipe', () => {
  let pipe: AddPrefixPipe;

  beforeEach(() => {
    pipe = new AddPrefixPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should prepend the prefix to the value', () => {
    const result = pipe.transform('world', 'hello ');
    expect(result).toBe('hello world');
  });

  it('should return just the prefix if value is empty', () => {
    const result = pipe.transform('', 'prefix-');
    expect(result).toBe('prefix-');
  });

  it('should return just the value if prefix is empty', () => {
    const result = pipe.transform('value', '');
    expect(result).toBe('value');
  });
});
