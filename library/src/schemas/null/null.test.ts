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
});
