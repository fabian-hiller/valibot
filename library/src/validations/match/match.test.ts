import { describe, expect, test } from 'vitest';
import { match } from './match.ts';

describe('match', () => {
  test('should pass only valid matches', () => {
    const validate = match(/abc/u);
    const value1 = 'abc';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = 'abcdev';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '123abc';
    expect(validate._parse(value3).output).toBe(value3);

    const validate2 = match(/abc/iu);
    const value4 = 'abc';
    expect(validate2._parse(value4).output).toBe(value4);
    const value5 = 'abcdef';
    expect(validate2._parse(value5).output).toBe(value5);
    const value6 = '123abc';
    expect(validate2._parse(value6).output).toBe(value6);
    const value7 = 'AbCd%';
    expect(validate2._parse(value7).output).toBe(value7);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('acb').issues).toBeTruthy();
    expect(validate._parse('Abc').issues).toBeTruthy();
    expect(validate._parse('123').issues).toBeTruthy();

    expect(validate2._parse('acb').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value not matching digit numbers!';
    const validate = match(/^\d/u, error);
    expect(validate._parse('abc').issues?.[0].message).toBe(error);
  });
});
