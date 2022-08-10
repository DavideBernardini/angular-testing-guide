import { StrengthPipe } from './strength.pipe';

describe('StrenghtPipe', () => {
  let pipe = new StrengthPipe();

  it('should display weak if strenght is less than 10', () => {
    expect(pipe.transform(5)).toEqual('5 (weak)');
  });

  it('should display strong if strenght is between 10 and 20', () => {
    expect(pipe.transform(10)).toEqual('10 (strong)');
  });

  it('should display unbelievable if strenght more than 20', () => {
    expect(pipe.transform(24)).toEqual('24 (unbelievable)');
  });
})
