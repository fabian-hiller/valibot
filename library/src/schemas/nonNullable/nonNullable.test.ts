import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { any } from '../any/index.ts';
import { null_ } from '../null/index.ts';
import { nullable } from '../nullable/index.ts';
import { number } from '../number/index.ts';
import { string } from '../string/index.ts';
import { undefined_ } from '../undefined/index.ts';
import { union } from '../union/index.ts';
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

  test('should expose the metadata', () => {
    const schema1 = nonNullable(any(), { description: 'non null value' });
    expect(schema1.metadata).toEqual({ description: 'non null value' });

    const schema2 = nonNullable(any(), {
      description: 'non null value',
      message: 'Value is not a non null!',
    });
    expect(schema2.metadata).toEqual({ description: 'non null value' });
    expect(schema2.message).toEqual('Value is not a non null!');

    const schema3 = nonNullable(any());
    expect(schema3.metadata).toBeUndefined();

    const schema4 = nonNullable(any({ description: 'any value' }));
    expect(schema4.metadata).toEqual({ description: 'any value' });
  });
});
