import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { literal } from './literal.ts';

describe('literal', () => {
  test('should pass only the literal', () => {
    const input1 = 'value_1';
    const schema1 = literal(input1);
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, false)).toThrowError();
    expect(() => parse(schema1, 'value_2')).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();

    const input2 = 123;
    const schema2 = literal(input2);
    const output2 = parse(schema2, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema2, 1234)).toThrowError();
    expect(() => parse(schema2, 'test')).toThrowError();
    expect(() => parse(schema2, {})).toThrowError();

    const input3 = 123n;
    const schema3 = literal(input3);
    const output3 = parse(schema3, input3);
    expect(output3).toBe(input3);
    expect(() => parse(schema3, 1234n)).toThrowError();
    expect(() => parse(schema3, true)).toThrowError();
    expect(() => parse(schema3, {})).toThrowError();

    const input4 = false;
    const schema4 = literal(input4);
    const output4 = parse(schema4, input4);
    expect(output4).toBe(input4);
    expect(() => parse(schema4, true)).toThrowError();
    expect(() => parse(schema4, 'test')).toThrowError();
    expect(() => parse(schema4, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not the literal!';
    expect(() => parse(literal('value_1', error), 'test')).toThrowError(error);
  });
});
