import { describe, expect, test } from 'vitest';
import { bic } from './bic.ts';

describe('bic', () => {
  test('should pass only valid BIC codes', () => {
    const validate = bic();

    const value1 = 'DEUTDEFF';
    expect(validate._parse(value1).output).toBe(value1);

    const value2 = 'deutdeff';
    expect(validate._parse(value2).output).toBe(value2);

    const value3 = 'DEUTDEFF400';
    expect(validate._parse(value3).output).toBe(value3);

    const value4 = 'NEDSZAJJXXX';
    expect(validate._parse(value4).output).toBe(value4);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('DEUTFF').issues).toBeTruthy();
    expect(validate._parse('DEUT5EFF').issues).toBeTruthy();
    expect(validate._parse('DE1TDEFF').issues).toBeTruthy();
    expect(validate._parse('DEUTDE00').issues).toBeTruthy();
    expect(validate._parse('DEUTDEFFXX').issues).toBeTruthy();
    expect(validate._parse('D_UTDEFF').issues).toBeTruthy();
    expect(validate._parse('DEUTDEDEDEED').issues).toBeTruthy();
    expect(validate._parse('DEUTDEFFF').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is invalid BIC code!';
    const validate = bic(error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
