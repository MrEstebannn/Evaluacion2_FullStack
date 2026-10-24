import { formatoCLP } from '../../src/utils/formato';

describe('utils/formato', () => {
  it('formatea un número como pesos chilenos con separador de miles', () => {
    expect(formatoCLP(25000)).toBe('$25.000');
    expect(formatoCLP(120000)).toBe('$120.000');
  });
  it('formatea el cero', () => {
    expect(formatoCLP(0)).toBe('$0');
  });
});