import { describe, expect, test } from 'vitest';
import { isbn } from './isbn.ts';

describe('isbn', () => {
  test('should pass only valid ISBN-10', () => {
    // ISBN-10
    const validate = isbn(10);

    const value1 = '0510652689';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '1617290858';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '0007269706';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = '3423214120';
    expect(validate._parse(value4).output).toBe(value4);
    const value5 = '340101319X';
    expect(validate._parse(value5).output).toBe(value5);
    const value6 = '3-8362-2119-5';
    expect(validate._parse(value6).output).toBe(value6);
    const value7 = '1-61729-085-8';
    expect(validate._parse(value7).output).toBe(value7);
    const value8 = '0-00-726970-6';
    expect(validate._parse(value8).output).toBe(value8);
    const value9 = '3-423-21412-0';
    expect(validate._parse(value9).output).toBe(value9);
    const value10 = '3-401-01319-X';
    expect(validate._parse(value10).output).toBe(value10);
  });

  test('should reject invalid ISBN-10', () => {
    const validate = isbn(10);

    expect(validate._parse('').issues).toBeTruthy();
    expect(validate._parse('3423214121').issues).toBeTruthy();
    expect(validate._parse('978-3836221191').issues).toBeTruthy();
    expect(validate._parse('123456789a').issues).toBeTruthy();
    expect(validate._parse('978-3836221191').issues).toBeTruthy();
    expect(validate._parse('3-423-21412-1').issues).toBeTruthy();
    expect(validate._parse('9783836221191').issues).toBeTruthy();
    expect(validate._parse('3 423 21412 1').issues).toBeTruthy();
    expect(validate._parse('foo test').issues).toBeTruthy();
  });

  test('should pass only valid ISBN-13', () => {
    const validate2 = isbn(13);

    const value11 = '9783836221191';
    expect(validate2._parse(value11).output).toBe(value11);
    const value12 = '9783401013190';
    expect(validate2._parse(value12).output).toBe(value12);
    const value13 = '9784873113685';
    expect(validate2._parse(value13).output).toBe(value13);
    const value14 = '978-3-8362-2119-1';
    expect(validate2._parse(value14).output).toBe(value14);
    const value15 = '978-3401013190';
    expect(validate2._parse(value15).output).toBe(value15);
    const value16 = '978-4-87311-368-5';
    expect(validate2._parse(value16).output).toBe(value16);
    const value17 = '978 3 8362 2119 1';
    expect(validate2._parse(value17).output).toBe(value17);
    const value18 = '978 3401013190';
    expect(validate2._parse(value18).output).toBe(value18);
    const value19 = '978 4 87311 368 5';
    expect(validate2._parse(value19).output).toBe(value19);
  });

  test('should reject invalid ISBN-13', () => {
    const validate2 = isbn(13);

    expect(validate2._parse('').issues).toBeTruthy();
    expect(validate2._parse('9783836221190').issues).toBeTruthy();
    expect(validate2._parse('3836221195').issues).toBeTruthy();
    expect(validate2._parse('01234567890ab').issues).toBeTruthy();
    expect(validate2._parse('978-3-8362-2119-0').issues).toBeTruthy();
    expect(validate2._parse('3-8362-2119-5').issues).toBeTruthy();
    expect(validate2._parse('978 3 8362 2119 0').issues).toBeTruthy();
    expect(validate2._parse('3 8362 2119 5').issues).toBeTruthy();
    expect(validate2._parse('foo test').issues).toBeTruthy();
  });

  test('should return custom error message for ISBN-10', () => {
    const error = 'Value is not an ISBN-10!';
    const validate = isbn(10, error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });

  test('should return custom error message for ISBN-13', () => {
    const error = 'Value is not an ISBN-13!';
    const validate = isbn(13, error);
    expect(validate._parse('test').issues?.[0].message).toBe(error);
  });
});
