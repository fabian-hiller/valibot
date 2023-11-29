import { describe, expect, test } from 'vitest';
import { parse, safeParse } from '../../methods/index.ts';
import { boolean } from '../boolean/index.ts';
import { literal } from '../literal/index.ts';
import { number } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string } from '../string/index.ts';
import { variant } from './variant.ts';

describe('variant', () => {
  test('should pass only variant values', () => {
    const schema1 = variant('type', [
      object({ type: literal('a'), a: string() }),
      object({ type: literal('b'), b: number() }),
    ]);
    const input1 = { type: 'a', a: 'hello' };
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = variant('type', [
      schema1,
      object({ type: literal('c'), b: boolean() }),
    ]);
    const input2 = { type: 'b', b: 123 };
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = { type: 'c', b: true };
    const output3 = parse(schema2, input3);
    expect(output3).toEqual(input3);

    expect(() => parse(schema2, null)).toThrowError();
    expect(() => parse(schema2, {})).toThrowError();
    expect(() => parse(schema2, { type: 'b', b: '123' })).toThrowError();
    expect(() => parse(schema2, { type: 'x' })).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not in variant!';
    expect(() =>
      parse(
        variant(
          'type',
          [
            object({ type: literal('a'), a: string() }),
            object({ type: literal('b'), b: number() }),
          ],
          error
        ),
        null
      )
    ).toThrowError(error);
  });

  test('should create the correct issue when passing a non object value', () => {
    const schema = variant('type', [
      object({ type: literal('a'), val: string() }),
      object({ type: literal('b'), val: number() }),
    ]);

    const result = safeParse(schema, true) as Record<string, unknown>;

    expect(result.issues).toEqual([
      {
        validation: 'variant',
        reason: 'type',
        message: 'Invalid type',
        input: true,
        origin: 'value',
      },
    ]);
  });

  test('should create the correct issue when passing an object value with non matching variant key', () => {
    const schema = variant('type', [
      object({ type: literal('a'), val: string() }),
      object({ type: literal('b'), val: number() }),
    ]);

    const result1 = safeParse(schema, { type: 'c', val: false }) as Record<
      string,
      unknown
    >;

    expect(result1.issues).toEqual([
      {
        validation: 'variant',
        reason: 'invalid_variant_key',
        message: 'Invalid variant key',
        input: 'c',
        origin: 'value',
        path: [
          {
            type: 'object',
            key: 'type',
            value: 'c',
            input: { type: 'c', val: false },
          },
        ],
        requirement: ['a', 'b'],
      },
    ]);

    const result2 = safeParse(schema, {}) as Record<string, unknown>;

    expect(result2.issues).toEqual([
      {
        validation: 'variant',
        reason: 'invalid_variant_key',
        message: 'Invalid variant key',
        input: undefined,
        origin: 'value',
        path: [{ type: 'object', key: 'type', value: undefined, input: {} }],
        requirement: ['a', 'b'],
      },
    ]);
  });
});
