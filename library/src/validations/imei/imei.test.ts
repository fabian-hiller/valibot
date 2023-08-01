import { describe, expect, test } from 'vitest';
import { imei } from './imei.ts';

describe('imei', () => {
  const info = { reason: 'any' as const };

  test('should pass only imei', () => {
    const validate = imei();
    const value1 = '536498459191226';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '860548042618881';
    expect(validate(value2, info)).toBe(value2);
    const value3 = '536889080592909';
    expect(validate(value3, info)).toBe(value3);
    const value4 = '527769279848588';
    expect(validate(value4, info)).toBe(value4);
    const value5 = '493218995348499';
    expect(validate(value5, info)).toBe(value5);
    const value6 = '304227331037178';
    expect(validate(value6, info)).toBe(value6);
    const value7 = '980323216845404';
    expect(validate(value7, info)).toBe(value7);
    const value8 = '304517506893326';
    expect(validate(value8, info)).toBe(value8);
    const value9 = '454438576454550';
    expect(validate(value9, info)).toBe(value9);
    const value10 = '450066366634505';
    expect(validate(value10, info)).toBe(value10);

    expect(() => validate('53649845919122', info)).toThrowError();
    expect(() => validate('a53649845919122', info)).toThrowError();
    expect(() => validate('536498459191227', info)).toThrowError();
    expect(() => validate('536498459191228', info)).toThrowError();
    expect(() => validate('plaintext', info)).toThrowError();
    expect(() => validate('', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an imei!';
    const validate = imei(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
