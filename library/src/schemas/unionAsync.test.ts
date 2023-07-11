import { describe, expect, test } from 'vitest';
import { parseAsync } from '../methods';
import { unionAsync } from './unionAsync';
import { string } from './string';
import { number } from './number';
import { nullType } from './null';
import { stringAsync } from './stringAsync';
import { numberAsync } from './numberAsync';

describe('unionAsync', () => {
  test('should pass only union values', async () => {
    const schema = unionAsync([stringAsync(), number(), nullType()]);

    const input1 = 'test';
    const output1 = await parseAsync(schema, input1);
    expect(output1).toBe(input1);

    const input2 = 123;
    const output2 = await parseAsync(schema, input2);
    expect(output2).toBe(input2);

    const input3 = null;
    const output3 = await parseAsync(schema, input3);
    expect(output3).toBe(input3);

    await expect(parseAsync(schema, 123n)).rejects.toThrowError();
    await expect(parseAsync(schema, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
    await expect(parseAsync(schema, [])).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not in union!';
    await expect(
      parseAsync(unionAsync([string(), numberAsync()], error), null)
    ).rejects.toThrowError(error);
  });
});
