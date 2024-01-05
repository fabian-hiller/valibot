import { describe, expect, test } from 'vitest';
import { number, object, objectAsync, string } from '../../schemas/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { parseAsync } from '../parse/index.ts';
import { mergeAsync } from './mergeAsync.ts';

describe('mergeAsync', () => {
  test('should merge object schemas', async () => {
    const schema = mergeAsync([
      objectAsync({ key1: string() }),
      object({ key2: number() }),
    ]);
    expect(JSON.stringify(schema)).toEqual(
      JSON.stringify(objectAsync({ key1: string(), key2: number() }))
    );
    const input = { key1: '1', key2: 2 };
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);
    await expect(parseAsync(schema, { key1: '1' })).rejects.toThrowError();
    await expect(parseAsync(schema, { key2: 2 })).rejects.toThrowError();
  });

  test('should overwrite schema of key', async () => {
    const schema = mergeAsync([
      objectAsync({ key: string() }),
      object({ key: number() }),
    ]);
    expect(JSON.stringify(schema.entries.key)).toEqual(
      JSON.stringify(number())
    );
    const input = { key: 123 };
    const output = await parseAsync(schema, input);
    expect(output).toEqual(input);
    await expect(parseAsync(schema, { key: 'test' })).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an object!';
    const schema = mergeAsync(
      [objectAsync({ key1: string() }), object({ key2: number() })],
      error
    );
    await expect(parseAsync(schema, 123)).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const input = { key1: '1', key2: 1 };
    const transformInput = () => ({ key1: '2', key2: 2 });
    const output1 = await parseAsync(
      mergeAsync(
        [objectAsync({ key1: string() }), object({ key2: number() })],
        [toCustom(transformInput)]
      ),
      input
    );
    const output2 = await parseAsync(
      mergeAsync(
        [objectAsync({ key1: string() }), object({ key2: number() })],
        'Error',
        [toCustom(transformInput)]
      ),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });
});
