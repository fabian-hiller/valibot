import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { maxLength } from '../../validations/index.ts';
import { any } from './any.ts';

describe('any', () => {
  test('should pass any values', () => {
    const schema = any();
    const input1 = 'hello';
    const output1 = parse(schema, input1);
    expect(output1).toBe(input1);
    const input2 = 123;
    const output2 = parse(schema, input2);
    expect(output2).toBe(input2);
    const input3 = { test: 123 };
    const output3 = parse(schema, input3);
    expect(output3).toEqual(input3);
  });

  test('should execute pipe', () => {
    const transformInput = () => 'hello';
    const output = parse(any([toCustom(transformInput)]), 123);
    expect(output).toBe(transformInput());
  });

  test('should expose the pipeline', () => {
    const schema1 = any([toCustom(String), maxLength(5)]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({ type: 'to_custom' }),
      expect.objectContaining({
        type: 'max_length',
        requirement: 5,
        message: 'Invalid length',
      }),
    ]);
  });

  test('should expose the metadata', () => {
    const schema1 = any({ description: 'any value' });
    expect(schema1.metadata).toEqual({ description: 'any value' });

    const schema2 = any();
    expect(schema2.metadata).toBeUndefined();
  });
});
