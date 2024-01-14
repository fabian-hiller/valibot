import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { email, maxLength, minLength } from '../../validations/index.ts';
import { string } from './string.ts';

describe('string', () => {
  describe('should pass', () => {
    const schema = string();

    test('empty string schema', () => {
      const input = '';
      const output = parse(schema, input);
      expect(output).toBe(input);
    });
  });

  describe('should reject', () => {
    const schema = string();

    test('schema, which includes numbers', () => {
      expect(() => parse(schema, 123)).toThrowError();
    });

    test('reject null schema', () => {
      expect(() => parse(schema, null)).toThrowError();
    });

    test('empty object schema', () => {
      expect(() => parse(schema, {})).toThrowError();
    });
  });

  test('should throw custom error', () => {
    const error = 'Value is not a string!';
    expect(() => parse(string(error), 123)).toThrowError(error);
  });

  describe('should execute pipe', () => {
    describe('minLength & maxLength', () => {
      const lengthError = 'Invalid length';
      const schema1 = string([minLength(1), maxLength(3)]);

      test('should pass correct length', () => {
        const input1 = '123';
        const output1 = parse(schema1, input1);
        expect(output1).toBe(input1);
      });

      test('should reject empty string', () => {
        expect(() => parse(schema1, '')).toThrowError(lengthError);
      });

      test('should reject to long strings', () => {
        expect(() => parse(schema1, '1234')).toThrowError(lengthError);
      });
    });

    describe('email', () => {
      const emailError = 'Invalid email';
      const schema2 = string('Error', [email()]);

      test('should pass', () => {
        const input2 = 'jane@example.com';
        const output2 = parse(schema2, input2);
        expect(output2).toBe(input2);
      });

      test('should reject invalid email address string', () => {
        expect(() => parse(schema2, 'jane@example')).toThrowError(emailError);
      });
    });
  });

  describe('schema pipeline', () => {
    const schema1 = string([minLength(2), maxLength(3)]);

    test('should contain invalid length message, type and requirements', () => {
      expect(schema1.pipe).toStrictEqual([
        expect.objectContaining({
          type: 'min_length',
          requirement: 2,
          message: 'Invalid length',
        }),
        expect.objectContaining({
          type: 'max_length',
          requirement: 3,
          message: 'Invalid length',
        }),
      ]);
    });

    test('should be undefined, if empty schema', () => {
      const schema2 = string();
      expect(schema2.pipe).toBeUndefined();
    });
  });
});
