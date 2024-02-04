import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { blobAsync } from './blobAsync.ts';

describe('blobAsync', () => {
  test('should pass only blobs', async () => {
    const schema = blobAsync();
    const input = new Blob(['123']);
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    await expect(parseAsync(schema, 2023)).rejects.toThrowError();
    await expect(parseAsync(schema, new Date())).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a blob!';
    await expect(parseAsync(blobAsync(error), 123)).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const value = new Blob(['123']);
    const output = await parseAsync(
      blobAsync([toCustom(() => value)]),
      new Blob()
    );
    expect(output).toBe(value);
  });

  test('should expose the metadata', () => {
    const schema1 = blobAsync({ description: 'blob value' });
    expect(schema1.metadata).toEqual({ description: 'blob value' });

    const schema2 = blobAsync({
      description: 'blob value',
      message: 'Value is not a blob!',
    });
    expect(schema2.metadata).toEqual({ description: 'blob value' });
    expect(schema2.message).toEqual('Value is not a blob!');

    const schema3 = blobAsync();
    expect(schema3.metadata).toBeUndefined();
  });
});
