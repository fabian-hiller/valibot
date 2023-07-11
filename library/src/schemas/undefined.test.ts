import { describe, expect, test } from 'vitest';
import { parse } from '../methods';
import { undefinedType } from './undefined';

describe('undefined', () => {
  test('should pass only undefined', () => {
    const schema = undefinedType();
    expect(parse(schema, undefined)).toBeUndefined();
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, 'test')).toThrowError();
    expect(() => parse(schema, false)).toThrowError();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not undefined!';
    expect(() => parse(undefinedType(error), 123)).toThrowError(error);
  });
});
