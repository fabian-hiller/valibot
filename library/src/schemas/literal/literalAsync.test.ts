import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { literalAsync } from './literalAsync.ts';

describe('literalAsync', () => {
  test('should pass only the literal', async () => {
    const input1 = 'value_1';
    const schema1 = literalAsync(input1);
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toBe(input1);
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, false)).rejects.toThrowError();
    await expect(parseAsync(schema1, 'value_2')).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();

    const input2 = 123;
    const schema2 = literalAsync(input2);
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema2, 1234)).rejects.toThrowError();
    await expect(parseAsync(schema2, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema2, {})).rejects.toThrowError();

    const input3 = 123n;
    const schema3 = literalAsync(input3);
    const output3 = await parseAsync(schema3, input3);
    expect(output3).toBe(input3);
    await expect(parseAsync(schema3, 1234n)).rejects.toThrowError();
    await expect(parseAsync(schema3, true)).rejects.toThrowError();
    await expect(parseAsync(schema3, {})).rejects.toThrowError();

    const input4 = false;
    const schema4 = literalAsync(input4);
    const output4 = await parseAsync(schema4, input4);
    expect(output4).toBe(input4);
    await expect(parseAsync(schema4, true)).rejects.toThrowError();
    await expect(parseAsync(schema4, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema4, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not the literal!';
    await expect(
      parseAsync(literalAsync('value_1', error), 'test')
    ).rejects.toThrowError(error);
  });
});
