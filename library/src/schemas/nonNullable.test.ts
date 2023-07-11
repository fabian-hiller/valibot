import { describe, expect, test } from 'vitest';
import { parse } from '../methods';
import { nonNullable } from './nonNullable';
import { union } from './union';
import { string } from './string';
import { nullType } from './null';
import { nullable } from './nullable';
import { number } from './number';
import { any } from './any';
import { undefinedType } from './undefined';

describe('nonNullable', () => {
  test('should not pass null', () => {
    const schema1 = nonNullable(union([string(), nullType(), undefinedType()]));
    const input1 = 'test';
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    expect(parse(schema1, undefined)).toBeUndefined();
    expect(() => parse(schema1, null)).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();

    const schema2 = nonNullable(nullable(number()));
    const input2 = 123;
    const output2 = parse(schema2, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema2, null)).toThrowError();
    expect(() => parse(schema2, undefined)).toThrowError();
    expect(() => parse(schema2, 'test')).toThrowError();
    expect(() => parse(schema2, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not non null!';
    expect(() => parse(nonNullable(any(), error), null)).toThrowError(error);
  });
});
