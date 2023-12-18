import { describe, expect, test } from 'vitest';
import { hexColor } from './hexColor.ts';

describe('hexColor', () => {
  test('should pass only a finite number', () => {
    const validate = hexColor();
    const value1 = '#FFFFFF';
    expect(validate._parse(value1).output).toBe(value1);

    const value2 = '#000000';
    expect(validate._parse(value2).output).toBe(value2);

    const value3 = '#FF5733';
    expect(validate._parse(value3).output).toBe(value3);

    const value4 = '#FF5';
    expect(validate._parse(value4).output).toBe(value4);

    const value5 = '#336699';
    expect(validate._parse(value5).output).toBe(value5);

    const value6 = '#abcdef';
    expect(validate._parse(value6).output).toBe(value6);

    const value7 = '#123456';
    expect(validate._parse(value7).output).toBe(value7);

    const value8 = '#123ABC';
    expect(validate._parse(value8).output).toBe(value8);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('#').issues).toBeTruthy();
    expect(validate._parse('123456').issues).toBeTruthy();
    expect(validate._parse('#GHIJKL').issues).toBeTruthy();
    expect(validate._parse('#12345').issues).toBeTruthy();
    expect(validate._parse('#123456789').issues).toBeTruthy();
    expect(validate._parse('#00 00FF').issues).toBeTruthy();
    expect(validate._parse('##0000FF').issues).toBeTruthy();
    expect(validate._parse('#000FFZ').issues).toBeTruthy();
    expect(validate._parse('#12345G').issues).toBeTruthy();
    expect(validate._parse('#!23456').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not a hexadecimal color value!';
    const validate = hexColor(error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
