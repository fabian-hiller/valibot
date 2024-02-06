import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { any } from '../any/index.ts';
import { null_ } from '../null/index.ts';
import { nullable } from '../nullable/index.ts';
import { number } from '../number/index.ts';
import { stringAsync } from '../string/index.ts';
import { undefined_ } from '../undefined/index.ts';
import { unionAsync } from '../union/index.ts';
import { nonNullableAsync } from './nonNullableAsync.ts';

describe('nonNullableAsync', () => {
  test('should not pass null', async () => {
    const schema1 = nonNullableAsync(
      unionAsync([stringAsync(), null_(), undefined_()])
    );
    const input1 = 'test';
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toBe(input1);
    expect(await parseAsync(schema1, undefined)).toBeUndefined();
    await expect(parseAsync(schema1, null)).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();

    const schema2 = nonNullableAsync(nullable(number()));
    const input2 = 123;
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema2, null)).rejects.toThrowError();
    await expect(parseAsync(schema2, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema2, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema2, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not non null!';
    await expect(
      parseAsync(nonNullableAsync(any(), error), null)
    ).rejects.toThrowError(error);
  });
});
