import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { null_ } from './null.ts';

describe('null_', () => {
  test('should pass only null', () => {
    const schema = null_();
    expect(parse(schema, null)).toBeNull();
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, '123')).toThrowError();
    expect(() => parse(schema, false)).toThrowError();
    expect(() => parse(schema, undefined)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not null!';
    expect(() => parse(null_(error), 123)).toThrowError(error);
  });

  test('should expose the metadata', () => {
    const schema1 = null_({ description: 'non optional value' });
    expect(schema1.metadata).toEqual({ description: 'non optional value' });

    const schema2 = null_({
      description: 'non optional value',
      message: 'Value is not a optional null!',
    });
    expect(schema2.metadata).toEqual({ description: 'non optional value' });
    expect(schema2.message).toEqual('Value is not a optional null!');

    const schema3 = null_();
    expect(schema3.metadata).toBeUndefined();
  });
});
