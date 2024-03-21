import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { symbol } from './symbol.ts';

describe('symbol', () => {
  test('should pass only symbols', () => {
    const schema = symbol();
    const input = Symbol('hello');
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, 'test')).toThrowError();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a symbol!';
    expect(() => parse(symbol(error), 123)).toThrowError(error);
  });

  test('should expose the metadata', () => {
    const schema1 = symbol({ description: 'symbol value' });
    expect(schema1.metadata).toEqual({ description: 'symbol value' });

    const schema2 = symbol({
      description: 'symbol value',
      message: 'Value is not a symbol!',
    });
    expect(schema2.metadata).toEqual({ description: 'symbol value' });
    expect(schema2.message).toEqual('Value is not a symbol!');

    const schema3 = symbol();
    expect(schema3.metadata).toBeUndefined();
  });
});
