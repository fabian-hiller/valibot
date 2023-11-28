import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { maxValue, minValue } from '../../validations/index.ts';
import { bigintAsync } from './bigintAsync.ts';

describe('bigintAsync', () => {
  test('should pass only bigints', async () => {
    const schema = bigintAsync();
    const input = 123n;
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, '123')).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a bigint!';
    await expect(parseAsync(bigintAsync(error), 123)).rejects.toThrowError(
      error
    );
  });

  test('should execute pipe', async () => {
    const valueError = 'Invalid value';

    const schema1 = bigintAsync([minValue(1n), maxValue(3n)]);
    const input1 = 2n;
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(parseAsync(schema1, 0n)).rejects.toThrowError(valueError);
    await expect(parseAsync(schema1, 12n)).rejects.toThrowError(valueError);

    const schema2 = bigintAsync('Error', [maxValue(3n)]);
    const input2 = 3n;
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(parseAsync(schema2, 12346789n)).rejects.toThrowError(
      valueError
    );
  });

  test('should expose the pipeline', () => {
    const schema1 = bigintAsync([maxValue(500n)]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({
        type: 'max_value',
        requirement: 500n,
        message: 'Invalid value',
      }),
    ]);

    const schema2 = bigintAsync();
    expect(schema2.pipe).toBeUndefined();
  });
});
