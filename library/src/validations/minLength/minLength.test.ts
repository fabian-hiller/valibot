import { describe, expect, test } from 'vitest';
import { minLength } from './minLength.ts';

describe('minLength', () => {
  describe('should pass', () => {
    test('valid length of string numbers', () => {
      const value = '123';
      expect(minLength(3)._parse(value)).toEqual({ output: value });
    });

    test('valid length of string numbers higher then min length', () => {
      const value = '12356';
      expect(minLength(3)._parse(value)).toEqual({ output: value });
    });

    test('valid length of array of numbers', () => {
      const value = [1, 2, 3];
      expect(minLength(3)._parse(value)).toEqual({ output: value });
    });

    test('valid length of array of empty objects', () => {
      const value = [{}, {}, {}];
      expect(minLength(3)._parse(value)).toEqual({ output: value });
    });
  });

  describe('should reject', () => {
    test('empty string', () => {
      expect(minLength(3)._parse('').issues).toBeTruthy();
    });

    test('string with invalid length', () => {
      expect(minLength(3)._parse('12').issues).toBeTruthy();
    });

    test('empty array', () => {
      expect(minLength(3)._parse([]).issues).toBeTruthy();
    });

    test('array of numbers with length lower then min length', () => {
      expect(minLength(3)._parse([1, 2]).issues).toBeTruthy();
    });

    test('array of objects with length lower then min length', () => {
      expect(minLength(3)._parse([{}, {}]).issues).toBeTruthy();
    });
  });

  test('should return custom error message', () => {
    const error = 'Value length is less than "3"!';
    const validate = minLength(3, error);
    expect(validate._parse('1').issues?.[0].message).toBe(error);
  });
});
