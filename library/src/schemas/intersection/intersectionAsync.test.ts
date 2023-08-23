import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { string, stringAsync } from '../string/index.ts';
import { number, numberAsync } from '../number/index.ts';
import { intersectionAsync } from './intersectionAsync.ts';
import { literalAsync } from '../literal/index.ts';
import { objectAsync } from '../object/index.ts';

describe('intersectionAsync', () => {
  test('should pass only intersection values', async () => {
    const schema = intersectionAsync([stringAsync(), literalAsync('test')]);
    const input = 'test';
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);

    await expect(parseAsync(schema, 'foo')).rejects.toThrowError();
    await expect(parseAsync(schema, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
    await expect(parseAsync(schema, [])).rejects.toThrowError();
  });

  test('should pass only intersection objects', async () => {
    const schema = intersectionAsync([
      objectAsync({
        foo: string(),
      }),
      objectAsync({
        bar: string(),
      }),
    ]);

    const input = { foo: 'test', bar: 'test' };
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);

    await expect(parseAsync(schema, { foo: 'test' })).rejects.toThrowError();
    await expect(parseAsync(schema, { bar: 'test' })).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not in intersection!';
    await expect(
      parseAsync(intersectionAsync([string(), numberAsync()], error), null)
    ).rejects.toThrowError(error);
  });
});
