import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { union } from '../union/index.ts';
import { string } from '../string/index.ts';
import { null_ } from '../null/index.ts';
import { nullable } from '../nullable/index.ts';
import { number } from '../number/index.ts';
import { any } from '../any/index.ts';
import { undefined_ } from '../undefined/index.ts';
import { nonNullable } from './nonNullable.ts';

describe('nonNullable', () => {
  test('should not pass null', () => {
    const schema1 = nonNullable(union([string(), null_(), undefined_()]));
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
