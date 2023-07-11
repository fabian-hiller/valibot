import { describe, expect, test } from 'vitest';
import { parse } from '../methods';
import { nullable } from './nullable';
import { string } from './string';

describe('nullable', () => {
  test('should pass also null', () => {
    const schema = nullable(string());
    const input = 'test';
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(parse(schema, null)).toBeNull();
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, false)).toThrowError();
    expect(() => parse(schema, undefined)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });
});
