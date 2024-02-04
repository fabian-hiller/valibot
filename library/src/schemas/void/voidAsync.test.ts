import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { voidAsync } from './voidAsync.ts';

describe('voidAsync', () => {
  test('should pass only void', async () => {
    const schema = voidAsync();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(await parseAsync(schema, (() => {})())).toBeUndefined();
    expect(await parseAsync(schema, undefined)).toBeUndefined();
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema, false)).rejects.toThrowError();
    await expect(parseAsync(schema, null)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not void!';
    await expect(parseAsync(voidAsync(error), 123)).rejects.toThrowError(error);
  });

  test('should expose the metadata', () => {
    const schema1 = voidAsync({ description: 'void value' });
    expect(schema1.metadata).toEqual({ description: 'void value' });

    const schema2 = voidAsync({
      description: 'void value',
      message: 'Value is not a void!',
    });
    expect(schema2.metadata).toEqual({ description: 'void value' });
    expect(schema2.message).toEqual('Value is not a void!');

    const schema3 = voidAsync();
    expect(schema3.metadata).toBeUndefined();
  });
});
