import { describe, expect, test } from 'vitest';
import { parseAsync } from '../methods';
import { stringAsync } from './stringAsync';
import { email, maxLength, minLength } from '../validations';

describe('stringAsync', () => {
  test('should pass only strings', async () => {
    const schema = stringAsync();
    const input = '';
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    await expect(parseAsync(schema, 123n)).rejects.toThrowError();
    await expect(parseAsync(schema, null)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a string!';
    await expect(parseAsync(stringAsync(error), 123)).rejects.toThrowError(
      error
    );
  });

  test('should execute pipe', async () => {
    const lengthError = 'Invalid length';
    const schema1 = stringAsync([minLength(1), maxLength(3)]);
    const input1 = '12';
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toBe(input1);
    await expect(parseAsync(schema1, '')).rejects.toThrowError(lengthError);
    await expect(parseAsync(schema1, '1234')).rejects.toThrowError(lengthError);

    const emailError = 'Invalid email';
    const schema2 = stringAsync('Error', [email()]);
    const input2 = 'jane@example.com';
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema2, 'jane@example')).rejects.toThrowError(
      emailError
    );
  });
});
