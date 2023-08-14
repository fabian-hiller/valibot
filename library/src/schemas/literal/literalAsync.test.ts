import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { literalAsync } from './literalAsync.ts';

describe('literalAsync', () => {
  test('should pass only the literal', async () => {
    const schema1 = literalAsync('value_1');
    const input1 = 'value_1';
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toBe(input1);
    const schema2 = literalAsync(123);
    const input2 = 123;
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, 'value_2')).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();
  });

  test('should pass for every primitive values', async () => {
    const TEST = Symbol('test');

    const numberSchema = literalAsync(1);
    const stringSchema = literalAsync('string');
    const booleanSchema = literalAsync(true);
    const symbolSchema = literalAsync(TEST);
    const bigIntSchema = literalAsync(2n);
    const nullSchema = literalAsync(null);
    const undefinedSchema = literalAsync(undefined);

    await expect(parseAsync(numberSchema, 1)).resolves.toBe(1);
    await expect(parseAsync(stringSchema, 'string')).resolves.toBe('string');
    await expect(parseAsync(booleanSchema, true)).resolves.toBe(true);
    await expect(parseAsync(symbolSchema, TEST)).resolves.toBe(TEST);
    await expect(parseAsync(bigIntSchema, 2n)).resolves.toBe(2n);
    await expect(parseAsync(nullSchema, null)).resolves.toBe(null);
    await expect(parseAsync(undefinedSchema, undefined)).resolves.toBe(
      undefined
    );
  });

  test('should throw custom error', async () => {
    const error = 'Value is not the literal!';
    await expect(
      parseAsync(literalAsync('value_1', error), 'test')
    ).rejects.toThrowError(error);
  });
});
