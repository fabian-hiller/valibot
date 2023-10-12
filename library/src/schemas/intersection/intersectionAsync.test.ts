import { describe, expect, test } from 'vitest';
import type { ValiError } from '../../error/index.ts';
import { parseAsync, transform } from '../../methods/index.ts';
import { literal } from '../literal/index.ts';
import { object } from '../object/index.ts';
import { record } from '../record/index.ts';
import { string } from '../string/index.ts';
import { unknown } from '../unknown/index.ts';
import {
  intersectionAsync,
  type IntersectionOptionsAsync,
} from './intersectionAsync.ts';

describe('intersectionAsync', () => {
  test('should pass only intersectionAsync values', async () => {
    const schema1 = intersectionAsync([string(), literal('test')]);
    const input1 = 'test';
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toBe(input1);
    await expect(parseAsync(schema1, 'foo')).rejects.toThrowError();
    await expect(parseAsync(schema1, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();
    await expect(parseAsync(schema1, [])).rejects.toThrowError();

    const schema2 = intersectionAsync([
      object({ foo: string() }),
      object({ bar: string() }),
    ]);
    const input2 = { foo: 'test', bar: 'test' };
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(parseAsync(schema2, { foo: 'test' })).rejects.toThrowError();
    await expect(parseAsync(schema2, { bar: 'test' })).rejects.toThrowError();

    const schema3 = intersectionAsync([
      object({ key1: string() }),
      record(string(), unknown()),
    ]);
    const input3 = { key1: 'test', keyX: 123 };
    const output3 = await parseAsync(schema3, input3);
    expect(output3).toEqual(input3);
    await expect(parseAsync(schema3, { keyX: 123 })).rejects.toThrowError();
    await expect(parseAsync(schema3, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a intersection!';
    const options: IntersectionOptionsAsync = [
      string(),
      transform(string(), (input) => input.length),
    ];
    await expect(
      parseAsync(intersectionAsync(options), 'test')
    ).rejects.toThrowError('Invalid type');
    await expect(
      parseAsync(intersectionAsync(options, error), 'test')
    ).rejects.toThrowError(error);
  });

  test('should throw every issue', async () => {
    const schema = intersectionAsync([string(), literal('test')]);
    const input = 123;
    await expect(parseAsync(schema, input)).rejects.toThrowError();
    try {
      await parseAsync(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', async () => {
    const schema = intersectionAsync([string(), literal('test')]);
    const input = 123;
    const info = { abortEarly: true };
    await expect(parseAsync(schema, input, info)).rejects.toThrowError();
    try {
      await parseAsync(schema, input, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });
});
