import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { any } from '../any/index.ts';
import { null_ } from '../null/index.ts';
import { number } from '../number/index.ts';
import { optional } from '../optional/index.ts';
import { string } from '../string/index.ts';
import { undefined_ } from '../undefined/index.ts';
import { union } from '../union/index.ts';
import { nonOptional } from './nonOptional.ts';

describe('nonOptional', () => {
  test('should not pass undefined', () => {
    const schema1 = nonOptional(union([string(), null_(), undefined_()]));
    const input1 = 'test';
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    expect(parse(schema1, null)).toBeNull();
    expect(() => parse(schema1, undefined)).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();

    const schema2 = nonOptional(optional(number()));
    const input2 = 123;
    const output2 = parse(schema2, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema2, null)).toThrowError();
    expect(() => parse(schema2, undefined)).toThrowError();
    expect(() => parse(schema2, 'test')).toThrowError();
    expect(() => parse(schema2, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not non optional!';
    expect(() => parse(nonOptional(any(), error), undefined)).toThrowError(
      error
    );
  });

  test('should expose the metadata', () => {
    const schema1 = nonOptional(any(), { description: 'non optional value' });
    expect(schema1.metadata).toEqual({ description: 'non optional value' });

    const schema2 = nonOptional(any(), {
      description: 'non optional value',
      message: 'Value is not a optional null!',
    });
    expect(schema2.metadata).toEqual({ description: 'non optional value' });
    expect(schema2.message).toEqual('Value is not a optional null!');

    const schema3 = nonOptional(any());
    expect(schema3.metadata).toBeUndefined();

    const schema4 = nonOptional(any({ description: 'any value' }));
    expect(schema4.metadata).toEqual({ description: 'any value' });
  });
});
