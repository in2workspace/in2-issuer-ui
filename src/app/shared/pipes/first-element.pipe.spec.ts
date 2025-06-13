import { FirstElementPipe } from './first-element.pipe';

describe('FirstElementPipe', () => {
  it('create an instance', () => {
    const pipe = new FirstElementPipe();
    expect(pipe).toBeTruthy();
  });
});
