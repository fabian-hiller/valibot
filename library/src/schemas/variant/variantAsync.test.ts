import { describe, expect, test } from 'vitest';
import { parseAsync, safeParseAsync } from '../../methods/index.ts';
import { boolean } from '../boolean/index.ts';
import { literal } from '../literal/index.ts';
import { number } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string } from '../string/index.ts';
import { variantAsync } from './variantAsync.ts';

describe('variantAsync', () => {
  test('should pass only variant values', async () => {
    const schema1 = variantAsync('type', [
      object({ type: literal('a'), a: string() }),
      object({ type: literal('b'), b: number() }),
    ]);
    const input1 = { type: 'a', a: 'hello' };
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = variantAsync('type', [
      schema1,
      object({ type: literal('c'), b: boolean() }),
    ]);
    const input2 = { type: 'b', b: 123 };
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = { type: 'c', b: true };
    const output3 = await parseAsync(schema2, input3);
    expect(output3).toEqual(input3);

    await expect(parseAsync(schema2, null)).rejects.toThrowError();
    await expect(parseAsync(schema2, {})).rejects.toThrowError();
    await expect(
      parseAsync(schema2, { type: 'b', b: '123' })
    ).rejects.toThrowError();
    await expect(parseAsync(schema2, { type: 'x' })).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not in variant!';
    await expect(
      parseAsync(
        variantAsync(
          'type',
          [
            object({ type: literal('a'), a: string() }),
            object({ type: literal('b'), b: number() }),
          ],
          error
        ),
        null
      )
    ).rejects.toThrowError(error);
  });

  test('should create the correct issue when passing a non object value', async () => {
    const schema = variantAsync('type', [
      object({ type: literal('a'), val: string() }),
      object({ type: literal('b'), val: number() }),
    ]);

    const result = (await safeParseAsync(schema, true)) as Record<
      string,
      unknown
    >;

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

  test('should create the correct issue when passing an object value with non matching variant key', async () => {
    const schema = variantAsync('type', [
      object({ type: literal('a'), val: string() }),
      object({ type: literal('b'), val: number() }),
    ]);

    const result1 = (await safeParseAsync(schema, {
      type: 'c',
      val: false,
    })) as Record<string, unknown>;

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
        requirement: schema.options,
      },
    ]);

    const result2 = (await safeParseAsync(schema, {})) as Record<
      string,
      unknown
    >;

    expect(result2.issues).toEqual([
      {
        validation: 'variant',
        reason: 'invalid_variant_key',
        message: 'Invalid variant key',
        input: undefined,
        origin: 'value',
        path: [{ type: 'object', key: 'type', value: undefined, input: {} }],
        requirement: schema.options,
      },
    ]);
  });
});
