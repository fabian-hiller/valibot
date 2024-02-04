import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { custom, length } from '../../validations/index.ts';
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

  test('should execute pipe with valid result', () => {
    const equalError = 'Not equal 10';

    const schema1 = union(
      [string(), number()],
      [custom((input) => +input === 10, equalError)]
    );
    expect(parse(schema1, '10')).toEqual('10');
    expect(parse(schema1, 10)).toEqual(10);
    expect(() => parse(schema1, '123')).toThrowError(equalError);
    expect(() => parse(schema1, 123)).toThrowError(equalError);

    const schema2 = union([string(), number()], 'Error', [
      custom((input) => +input === 10, equalError),
    ]);
    expect(parse(schema2, '10')).toEqual('10');
    expect(parse(schema2, 10)).toEqual(10);
    expect(() => parse(schema2, '123')).toThrowError(equalError);
    expect(() => parse(schema2, 123)).toThrowError(equalError);
  });

  test('should execute pipe with single typed result', () => {
    const equalError = 'Not equal 10';
    const lengthError = 'Invalid string length';

    const schema1 = union(
      [string([length(2, lengthError)]), number()],
      [custom((input) => +input === 10, equalError)]
    );
    expect(parse(schema1, '10')).toEqual('10');
    expect(parse(schema1, 10)).toEqual(10);
    expect(() => parse(schema1, '1')).toThrowError(lengthError);
    expect(() => parse(schema1, '123')).toThrowError(lengthError);
    expect(() => parse(schema1, 11)).toThrowError(equalError);

    const schema2 = union(
      [string([length(2, lengthError)]), number()],
      'Error',
      [custom((input) => +input === 10, equalError)]
    );
    expect(parse(schema2, '10')).toEqual('10');
    expect(parse(schema2, 10)).toEqual(10);
    expect(() => parse(schema2, '1')).toThrowError(lengthError);
    expect(() => parse(schema2, '123')).toThrowError(lengthError);
    expect(() => parse(schema2, 11)).toThrowError(equalError);
  });

  test('should execute pipe with multiple typed results', () => {
    const invalidError = 'Invalid string value';
    const schema = union(
      [string([length(2)]), string([length(4)])],
      invalidError,
      [custom((input) => +input % 2 === 0)]
    );
    expect(parse(schema, '10')).toEqual('10');
    expect(parse(schema, '2222')).toEqual('2222');
    expect(() => parse(schema, '1')).toThrowError(invalidError);
    expect(() => parse(schema, '123')).toThrowError(invalidError);
  });

  test('should return single untyped result', () => {
    const typeError = 'Not a string!';
    const schema = union([string(typeError)]);
    expect(parse(schema, 'foo')).toEqual('foo');
    expect(parse(schema, '123')).toEqual('123');
    expect(() => parse(schema, null)).toThrowError(typeError);
    expect(() => parse(schema, 123)).toThrowError(typeError);
  });

  test('should expose the metadata', () => {
    const schema1 = union([string()], { description: 'string value' });
    expect(schema1.metadata).toEqual({ description: 'string value' });

    const schema2 = union([string()], {
      description: 'string value',
      message: 'Value is not a string!',
    });
    expect(schema2.metadata).toEqual({ description: 'string value' });
    expect(schema2.message).toEqual('Value is not a string!');

    const schema3 = union([string()]);
    expect(schema3.metadata).toBeUndefined();
  });
});
