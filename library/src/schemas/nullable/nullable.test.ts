import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { string } from '../string/index.ts';
import { nullable } from './nullable.ts';

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

  test('should use default if required', () => {
    const default_ = 'default';
    const input = 'test';

    const schema1 = nullable(string(), default_);
    expect(parse(schema1, input)).toBe(input);
    expect(parse(schema1, null)).toBe(default_);

    const schema2 = nullable(string(), () => default_);
    expect(parse(schema2, input)).toBe(input);
    expect(parse(schema2, null)).toBe(default_);
  });

  test('should expose the metadata', () => {
    const schema1 = nullable(string({ description: 'nullable string' }));
    expect(schema1.metadata).toEqual({ description: 'nullable string' });
  });
});
