import { describe, expect, test } from 'vitest';
import { parse } from '../../methods';
import { literal } from './literal';

describe('literal', () => {
  test('should pass only the literal', () => {
    const schema1 = literal('value_1');
    const input1 = 'value_1';
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    const schema2 = literal(123);
    const input2 = 123;
    const output2 = parse(schema2, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, 'value_2')).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not the literal!';
    expect(() => parse(literal('value_1', error), 'test')).toThrowError(error);
  });
});
