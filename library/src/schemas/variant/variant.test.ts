import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { custom } from '../../validations/index.ts';
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
    const input2 = { type: 'b', b: 123 };
    const output2 = parse(schema1, input2);
    expect(output2).toEqual(input2);

    const schema2 = variant('type', [
      schema1,
      object({ type: literal('c'), foo: literal('foo') }),
      object({ type: literal('c'), bar: literal('bar') }),
    ]);
    const input3 = { type: 'b', b: 123 };
    const output3 = parse(schema2, input3);
    expect(output3).toEqual(input3);
    const input4 = { type: 'c', foo: 'foo' };
    const output4 = parse(schema2, input4);
    expect(output4).toEqual(input4);
    const input5 = { type: 'c', bar: 'bar' };
    const output5 = parse(schema2, input5);
    expect(output5).toEqual(input5);

    expect(() => parse(schema2, null)).toThrowError();
    expect(() => parse(schema2, {})).toThrowError();
    expect(() => parse(schema2, { type: 'b', b: '123' })).toThrowError();
    expect(() => parse(schema2, { type: 'c', c: 123 })).toThrowError();
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

  test('should execute pipe', () => {
    const error = 'Input is invalid';

    const schema1 = variant(
      'type',
      [
        object({ type: literal('a'), a: string() }),
        object({ type: literal('b'), b: number() }),
      ],
      [
        custom(
          (input) =>
            (input.type === 'a' && input.a === 'test') ||
            (input.type === 'b' && input.b === 10),
          error
        ),
      ]
    );
    const input1 = { type: 'a', a: 'test' };
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    const input2 = { type: 'b', b: 10 };
    const output2 = parse(schema1, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema1, { type: 'a', a: 'foo' })).toThrowError(error);
    expect(() => parse(schema1, { type: 'b', b: 123 })).toThrowError(error);

    const schema2 = variant(
      'type',
      [
        object({ type: literal('a'), a: string() }),
        object({ type: literal('b'), b: number() }),
      ],
      'Error',
      [
        custom(
          (input) =>
            (input.type === 'a' && input.a === 'test') ||
            (input.type === 'b' && input.b === 10),
          error
        ),
      ]
    );
    const input3 = { type: 'a', a: 'test' };
    const output3 = parse(schema2, input3);
    expect(output3).toEqual(input3);
    const input4 = { type: 'b', b: 10 };
    const output4 = parse(schema2, input4);
    expect(output4).toEqual(input4);
    expect(() => parse(schema2, { type: 'a', a: 'foo' })).toThrowError(error);
    expect(() => parse(schema2, { type: 'b', b: 123 })).toThrowError(error);
  });
});
