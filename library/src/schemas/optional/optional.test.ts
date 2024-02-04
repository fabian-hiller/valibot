import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { string } from '../string/index.ts';
import { optional } from './optional.ts';

describe('optional', () => {
  test('should pass also undefined', () => {
    const schema = optional(string());
    const input = 'test';
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(parse(schema, undefined)).toBeUndefined();

    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, false)).toThrowError();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should use default if required', () => {
    const default_ = 'default';
    const input = 'test';

    const schema1 = optional(string(), default_);
    expect(parse(schema1, input)).toBe(input);
    expect(parse(schema1, undefined)).toBe(default_);

    const schema2 = optional(string(), () => default_);
    expect(parse(schema2, input)).toBe(input);
    expect(parse(schema2, undefined)).toBe(default_);
  });

  test('should expose the metadata', () => {
    const schema1 = optional(string({ description: 'optional string' }));
    expect(schema1.metadata).toEqual({ description: 'optional string' });
  });
});
