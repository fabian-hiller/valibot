import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
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
    const output = parse(any([transformInput]), 123);
    expect(output).toBe(transformInput());
  });
});
