import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { email, maxLength, minLength } from '../../validations/index.ts';
import { stringAsync } from './stringAsync.ts';

describe('stringAsync', () => {
  describe('should pass', () => {
    const schema = stringAsync();

    test('empty string schema', async () => {
      const input = '';
      const output = await parseAsync(schema, input);
      expect(output).toBe(input);
    });
  });

  describe('should reject', () => {
    const schema = stringAsync();

    test('schema, if not string', async () => {
      await expect(parseAsync(schema, 123n)).rejects.toThrowError(
        'Invalid type'
      );
    });

    test('null schema', async () => {
      await expect(parseAsync(schema, null)).rejects.toThrowError(
        'Invalid type'
      );
    });

    test('empty object schema', async () => {
      await expect(parseAsync(schema, {})).rejects.toThrowError('Invalid type');
    });
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a string!';
    await expect(parseAsync(stringAsync(error), 123)).rejects.toThrowError(
      error
    );
  });

  describe('should execute pipe', () => {
    describe('minLength and maxLength', async () => {
      const lengthError = 'Invalid length';
      const schema1 = stringAsync([minLength(1), maxLength(3)]);

      test('should pass correct length', async () => {
        const input1 = '123';
        expect(await parseAsync(schema1, input1)).toBe(input1);
      });

      test('should reject empty string', async () => {
        await expect(parseAsync(schema1, '')).rejects.toThrowError(lengthError);
      });

      test('should reject to long strings', async () => {
        await expect(parseAsync(schema1, '1234')).rejects.toThrowError(
          lengthError
        );
      });
    });

    describe('email', () => {
      const emailError = 'Invalid email';
      const schema2 = stringAsync('Error', [email()]);

      test('should pass', async () => {
        const input2 = 'jane@example.com';
        const output2 = await parseAsync(schema2, input2);
        expect(output2).toBe(input2);
      });

      test('should reject invalid email address string', async () => {
        await expect(parseAsync(schema2, 'jane@example')).rejects.toThrowError(
          emailError
        );
      });
    });
  });

  describe('schema', () => {
    test('should expose properties', async () => {
      const schema1 = stringAsync([minLength(2), maxLength(3)]);
      expect(schema1).toStrictEqual(
        expect.objectContaining({
          type: 'string',
          expects: 'string',
          async: true,
          message: undefined,
        })
      );
    });
    test('should expose the pipeline', async () => {
      const schema1 = stringAsync([minLength(2), maxLength(3)]);
      expect(schema1.pipe).toStrictEqual([
        expect.objectContaining({
          type: 'min_length',
          expects: '>=2',
          requirement: 2,
          async: false,
          message: undefined,
        }),
        expect.objectContaining({
          type: 'max_length',
          expects: '<=3',
          requirement: 3,
          async: false,
          message: undefined,
        }),
      ]);
    });

    test('should be undefined, if empty schema', () => {
      const schema2 = stringAsync();
      expect(schema2.pipe).toBeUndefined();
    });
  });
});
