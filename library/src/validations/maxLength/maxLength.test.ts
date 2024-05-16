import { describe, expect, test } from 'vitest';
import { maxLength } from './maxLength.ts';

describe('maxLength', () => {
  describe('should pass only valid lengths', () => {
    test('empty string has valid length', () => {
      const value = '';
      expect(maxLength(3)._parse(value)).toEqual({ output: value });
    });

    test('string of length 2 has valid length', () => {
      const value = '12';
      expect(maxLength(3)._parse(value)).toEqual({ output: value });
    });

    test('array of numbers and length 3 has valid length', () => {
      const value = [1, 2, 3];
      expect(maxLength(3)._parse(value)).toEqual({ output: value });
    });

    test('array of objects and length 3 has valid length', () => {
      const value = [{}, {}, {}];
      expect(maxLength(3)._parse(value)).toEqual({ output: value });
    });
  });

  describe('should reject', () => {
    test('string length of 4', () => {
      expect(maxLength(3)._parse('1234').issues).toBeTruthy();
    });

    test('string of longer length then max length', () => {
      expect(maxLength(3)._parse('123456789').issues).toBeTruthy();
    });

    test('array of numbers with 1 more then maxLength', () => {
      expect(maxLength(3)._parse([1, 2, 3, 4]).issues).toBeTruthy();
    });

    test('larger array of numbers with 1 more then maxLength', () => {
      expect(maxLength(3)._parse([1, 2, 3, 4, 5, 6, 7, 8]).issues).toBeTruthy();
    });

    test('array of objects with 1 more then maxLength', () => {
      expect(maxLength(3)._parse([{}, {}, {}, {}]).issues).toBeTruthy();
    });
  });

  test('should return custom error message', () => {
    const error = 'Value length is greater than "3"!';
    expect(maxLength(3, error)._parse('test').issues?.[0].context.message).toBe(
      error
    );
  });
});
