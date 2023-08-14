import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { literal } from './literal.ts';

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

  test('should pass for every primitive values', () => {
    const TEST = Symbol('test');

    const numberSchema = literal(1);
    const stringSchema = literal('string');
    const booleanSchema = literal(true);
    const symbolSchema = literal(TEST);
    const bigIntSchema = literal(2n);
    const nullSchema = literal(null);
    const undefinedSchema = literal(undefined);

    expect(parse(numberSchema, 1)).toBe(1);
    expect(parse(stringSchema, 'string')).toBe('string');
    expect(parse(booleanSchema, true)).toBe(true);
    expect(parse(symbolSchema, TEST)).toBe(TEST);
    expect(parse(bigIntSchema, 2n)).toBe(2n);
    expect(parse(nullSchema, null)).toBe(null);
    expect(parse(undefinedSchema, undefined)).toBe(undefined);
  });

  test('should throw custom error', () => {
    const error = 'Value is not the literal!';
    expect(() => parse(literal('value_1', error), 'test')).toThrowError(error);
  });
});
