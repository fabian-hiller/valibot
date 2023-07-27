import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { maxValue, minValue } from '../../validations/index.ts';
import { instanceAsync } from './instanceAsync.ts';

describe('instanceAsync', () => {
  test('should pass only valid instances', async () => {
    const schema = instanceAsync(Date);
    const input = new Date();
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);
    await expect(parseAsync(schema, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
    await expect(parseAsync(schema, new Map())).rejects.toThrowError();
    await expect(parseAsync(schema, new Error())).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an instance!';
    await expect(
      parseAsync(instanceAsync(Date, error), 123)
    ).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const valueError = 'Invalid value';

    const schema1 = instanceAsync(Date, [
      minValue(new Date(Date.now() - 3600000)),
      maxValue(new Date(Date.now() + 3600000)),
    ]);
    const input1 = new Date();
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(
      parseAsync(schema1, new Date(Date.now() - 4000000))
    ).rejects.toThrowError(valueError);
    await expect(
      parseAsync(schema1, new Date(Date.now() + 4000000))
    ).rejects.toThrowError(valueError);

    const schema2 = instanceAsync(Date, 'Error', [maxValue(new Date())]);
    const input2 = new Date(Date.now() - 120000);
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(
      parseAsync(schema2, new Date(Date.now() + 1))
    ).rejects.toThrowError(valueError);
  });
});
