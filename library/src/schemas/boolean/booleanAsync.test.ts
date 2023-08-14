import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { booleanAsync } from './booleanAsync.ts';

describe('booleanAsync', () => {
  test('should pass only booleans', async () => {
    const schema = booleanAsync();
    const input1 = true;
    const output1 = await parseAsync(schema, input1);
    expect(output1).toBe(input1);
    const input2 = false;
    const output2 = await parseAsync(schema, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, 'true')).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a boolean!';
    await expect(parseAsync(booleanAsync(error), 'test')).rejects.toThrowError(
      error
    );
  });

  test('should execute pipe', async () => {
    const transformInput = () => false;
    const output1 = await parseAsync(
      booleanAsync([toCustom(transformInput)]),
      true
    );
    expect(output1).toBe(transformInput());
    const output2 = await parseAsync(
      booleanAsync('Error', [toCustom(transformInput)]),
      true
    );
    expect(output2).toBe(transformInput());
  });
});
