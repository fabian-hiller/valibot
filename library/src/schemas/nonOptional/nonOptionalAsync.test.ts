import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods';
import { nullType } from '../nullType';
import { number } from '../number';
import { any } from '../any';
import { undefinedType } from '../undefinedType';
import { unionAsync } from '../union';
import { stringAsync } from '../string';
import { optionalAsync } from '../optional';
import { nonOptionalAsync } from './nonOptionalAsync';

describe('nonOptionalAsync', () => {
  test('should not pass undefined', async () => {
    const schema1 = nonOptionalAsync(
      unionAsync([stringAsync(), nullType(), undefinedType()])
    );
    const input1 = 'test';
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toBe(input1);
    expect(await parseAsync(schema1, null)).toBeNull();
    await expect(parseAsync(schema1, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();

    const schema2 = nonOptionalAsync(optionalAsync(number()));
    const input2 = 123;
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema2, null)).rejects.toThrowError();
    await expect(parseAsync(schema2, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema2, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema2, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not non optional!';
    await expect(
      parseAsync(nonOptionalAsync(any(), error), undefined)
    ).rejects.toThrowError(error);
  });
});
