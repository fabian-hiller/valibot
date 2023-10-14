import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { maxLength } from '../../validations/index.ts';
import { anyAsync } from './anyAsync.ts';

describe('anyAsync', () => {
  test('should pass any values', async () => {
    const schema = anyAsync();
    const input1 = 'hello';
    const output1 = await parseAsync(schema, input1);
    expect(output1).toBe(input1);
    const input2 = 123;
    const output2 = await parseAsync(schema, input2);
    expect(output2).toBe(input2);
    const input3 = { test: 123 };
    const output3 = await parseAsync(schema, input3);
    expect(output3).toEqual(input3);
  });

  test('should execute pipe', async () => {
    const transformInput = () => 'hello';
    const output = await parseAsync(anyAsync([toCustom(transformInput)]), 123);
    expect(output).toBe(transformInput());
  });

  test(`should expose a pipe of transforms and validations`, () => {
    const schema1 = anyAsync([toCustom(String), maxLength(5)]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({ kind: 'to_custom' }),
      expect.objectContaining({
        kind: 'max_length',
        requirement: 5,
        message: 'Invalid length',
      }),
    ]);

    const schema2 = anyAsync();
    expect(schema2.pipe).toStrictEqual([]);
  });
});
