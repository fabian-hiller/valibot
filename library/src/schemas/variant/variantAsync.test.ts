import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { custom, customAsync } from '../../validations/index.ts';
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

  test('should execute pipe', async () => {
    const error = 'Input is invalid';

    const schema1 = variantAsync(
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
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    const input2 = { type: 'b', b: 10 };
    const output2 = await parseAsync(schema1, input2);
    expect(output2).toEqual(input2);
    expect(() =>
      parseAsync(schema1, { type: 'a', a: 'foo' })
    ).rejects.toThrowError(error);
    expect(() =>
      parseAsync(schema1, { type: 'b', b: 123 })
    ).rejects.toThrowError(error);

    const schema2 = variantAsync(
      'type',
      [
        object({ type: literal('a'), a: string() }),
        object({ type: literal('b'), b: number() }),
      ],
      'Error',
      [
        customAsync(
          async (input) =>
            (input.type === 'a' && input.a === 'test') ||
            (input.type === 'b' && input.b === 10),
          error
        ),
      ]
    );
    const input3 = { type: 'a', a: 'test' };
    const output3 = await parseAsync(schema2, input3);
    expect(output3).toEqual(input3);
    const input4 = { type: 'b', b: 10 };
    const output4 = await parseAsync(schema2, input4);
    expect(output4).toEqual(input4);
    expect(parseAsync(schema2, { type: 'a', a: 'foo' })).rejects.toThrowError(
      error
    );
    expect(parseAsync(schema2, { type: 'b', b: 123 })).rejects.toThrowError(
      error
    );
  });
});
