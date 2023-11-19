import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { string } from '../string/index.ts';
import { number } from '../number/index.ts';
import { null_ } from '../null/index.ts';
import { union } from './union.ts';

describe('union', () => {
  test('should pass only union values', () => {
    const schema = union([string(), number(), null_()]);
    const input1 = 'test';
    const output1 = parse(schema, input1);
    expect(output1).toBe(input1);
    const input2 = 123;
    const output2 = parse(schema, input2);
    expect(output2).toBe(input2);
    const input3 = null;
    const output3 = parse(schema, input3);
    expect(output3).toBe(input3);
    expect(() => parse(schema, 123n)).toThrowError();
    expect(() => parse(schema, undefined)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
    expect(() => parse(schema, [])).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not in union!';
    expect(() => parse(union([string(), number()], error), null)).toThrowError(
      error
    );
  });
});
