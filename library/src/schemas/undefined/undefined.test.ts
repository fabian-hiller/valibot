import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { undefined_ } from './undefined.ts';

describe('undefined', () => {
  test('should pass only undefined', () => {
    const schema = undefined_();
    expect(parse(schema, undefined)).toBeUndefined();
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, 'test')).toThrowError();
    expect(() => parse(schema, false)).toThrowError();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not undefined!';
    expect(() => parse(undefined_(error), 123)).toThrowError(error);
  });

  test('should expose the metadata', () => {
    const schema1 = undefined_({ description: 'undefined value' });
    expect(schema1.metadata).toEqual({ description: 'undefined value' });

    const schema2 = undefined_({
      description: 'undefined value',
      message: 'Value is not undefined!',
    });
    expect(schema2.metadata).toEqual({ description: 'undefined value' });
    expect(schema2.message).toEqual('Value is not undefined!');

    const schema3 = undefined_();
    expect(schema3.metadata).toBeUndefined();
  });
});
