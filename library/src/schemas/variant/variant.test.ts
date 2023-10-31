import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
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
});
