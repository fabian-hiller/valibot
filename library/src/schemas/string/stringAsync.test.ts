import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { email, maxLength, minLength } from '../../validations/index.ts';
import { stringAsync } from './stringAsync.ts';

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

  test('should expose the pipeline', () => {
    const schema1 = stringAsync([minLength(2), maxLength(3)]);
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

    const schema2 = stringAsync();
    expect(schema2.pipe).toBeUndefined();
  });

  test('should expose the metadata', () => {
    const schema1 = stringAsync({ description: 'string value' });
    expect(schema1.metadata).toEqual({ description: 'string value' });

    const schema2 = stringAsync({
      description: 'string value',
      message: 'Value is not a string!',
    });
    expect(schema2.metadata).toEqual({ description: 'string value' });
    expect(schema2.message).toEqual('Value is not a string!');

    const schema3 = stringAsync();
    expect(schema3.metadata).toBeUndefined();
  });
});
