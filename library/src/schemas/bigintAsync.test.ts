import { describe, expect, test } from 'vitest';
import { parseAsync } from '../methods';
import { bigintAsync } from './bigintAsync';
import { maxRange, minRange } from '../validations';

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
    const rangeError = 'Invalid range';

    const schema1 = bigintAsync([minRange(1n), maxRange(3n)]);
    const input1 = 2n;
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(parseAsync(schema1, 0n)).rejects.toThrowError(rangeError);
    await expect(parseAsync(schema1, 12n)).rejects.toThrowError(rangeError);

    const schema2 = bigintAsync('Error', [maxRange(3n)]);
    const input2 = 3n;
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(parseAsync(schema2, 12346789n)).rejects.toThrowError(
      rangeError
    );
  });
});
