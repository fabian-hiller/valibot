import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parseAsync } from '../../methods/index.ts';
import { number } from '../number/index.ts';
import { string, stringAsync } from '../string/index.ts';
import { objectAsync } from './objectAsync.ts';

describe('objectAsync', () => {
  test('should pass only objects', async () => {
    const schema = objectAsync({ key1: stringAsync(), key2: number() });
    const input = { key1: 'test', key2: 123 };
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);
    await expect(parseAsync(schema, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
    await expect(parseAsync(schema, new Map())).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an object!';
    const schema = objectAsync({}, error);
    await expect(parseAsync(schema, 123)).rejects.toThrowError(error);
  });

  test('should throw every issue', async () => {
    const schema = objectAsync({ 1: number(), 2: number(), 3: number() });
    const input = { 1: '1', 2: 2, 3: '3' };
    await expect(parseAsync(schema, input)).rejects.toThrowError();
    try {
      await parseAsync(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', async () => {
    const schema = objectAsync({ 1: number(), 2: number(), 3: number() });
    const input = { 1: '1', 2: 2, 3: '3' };
    const info = { abortEarly: true };
    await expect(parseAsync(schema, input, info)).rejects.toThrowError();
    try {
      await parseAsync(schema, input, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should execute pipe', async () => {
    const input = { key1: '1', key2: 1 };
    const transformInput = () => ({ key1: '2', key2: 2 });
    const output1 = await parseAsync(
      objectAsync({ key1: string(), key2: number() }, [transformInput]),
      input
    );
    const output2 = await parseAsync(
      objectAsync({ key1: string(), key2: number() }, 'Error', [
        transformInput,
      ]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });
});
