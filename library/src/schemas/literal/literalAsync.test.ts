import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { literalAsync } from './literalAsync.ts';

describe('literalAsync', () => {
  test('should pass only the literal', async () => {
    const schema1 = literalAsync('value_1');
    const input1 = 'value_1';
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toBe(input1);
    const schema2 = literalAsync(123);
    const input2 = 123;
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, 'value_2')).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not the literal!';
    await expect(
      parseAsync(literalAsync('value_1', error), 'test')
    ).rejects.toThrowError(error);
  });
});
