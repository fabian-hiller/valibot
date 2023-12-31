import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { picklistAsync } from './picklistAsync.ts';

describe('picklistAsync', () => {
  test('should pass only picklist values', async () => {
    const schema = picklistAsync(['value_1', 'value_2']);
    const input1 = 'value_1';
    const output1 = await parseAsync(schema, input1);
    expect(output1).toBe(input1);
    const input2 = 'value_2';
    const output2 = await parseAsync(schema, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, 'value_3')).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a picklist value!';
    await expect(
      parseAsync(picklistAsync(['value_1'], error), 'test')
    ).rejects.toThrowError(error);
  });
});
