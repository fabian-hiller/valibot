import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { maxValue, minValue } from '../../validations/index.ts';
import { dateAsync } from './dateAsync.ts';

describe('dateAsync', () => {
  test('should pass only dates', async () => {
    const schema = dateAsync();
    const input = new Date();
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);
    await expect(parseAsync(schema, 2023)).rejects.toThrowError();
    await expect(parseAsync(schema, '2023-07-10')).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a date!';
    await expect(parseAsync(dateAsync(error), 123)).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const valueError = 'Invalid value';

    const schema1 = dateAsync([
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

    const schema2 = dateAsync('Error', [maxValue(new Date())]);
    const input2 = new Date(Date.now() - 120000);
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(
      parseAsync(schema2, new Date(Date.now() + 1))
    ).rejects.toThrowError(valueError);
  });

  test(`should expose a pipe of transforms and validations`, () => {
    const requirement = new Date(Date.now() + 3600000);
    const schema1 = dateAsync([maxValue(requirement)]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({
        kind: 'max_value',
        requirement,
        message: 'Invalid value',
      }),
    ]);

    const schema2 = dateAsync();
    expect(schema2.pipe).toStrictEqual([]);
  });
});
