import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { string } from '../string/index.ts';
import { nullish } from './nullish.ts';

describe('nullish', () => {
  test('should pass also null and undefined', () => {
    const schema = nullish(string());
    const input = 'test';
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(parse(schema, null)).toBeNull();
    expect(parse(schema, undefined)).toBeUndefined();

    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, false)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should use default if required', () => {
    const default_ = 'default';
    const input = 'test';

    const schema1 = nullish(string(), default_);
    expect(parse(schema1, input)).toBe(input);
    expect(parse(schema1, null)).toBe(default_);
    expect(parse(schema1, undefined)).toBe(default_);

    const schema2 = nullish(string(), () => default_);
    expect(parse(schema2, input)).toBe(input);
    expect(parse(schema2, null)).toBe(default_);
    expect(parse(schema2, undefined)).toBe(default_);
  });
});
