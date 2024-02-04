import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { undefinedAsync } from './undefinedAsync.ts';

describe('undefinedAsync', () => {
  test('should pass only undefined', async () => {
    const schema = undefinedAsync();
    expect(await parseAsync(schema, undefined)).toBeUndefined();
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema, false)).rejects.toThrowError();
    await expect(parseAsync(schema, null)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not undefined!';
    await expect(parseAsync(undefinedAsync(error), 123)).rejects.toThrowError(
      error
    );
  });

  test('should expose the metadata', () => {
    const schema1 = undefinedAsync({ description: 'undefined value' });
    expect(schema1.metadata).toEqual({ description: 'undefined value' });

    const schema2 = undefinedAsync({
      description: 'undefined value',
      message: 'Value is not undefined!',
    });
    expect(schema2.metadata).toEqual({ description: 'undefined value' });
    expect(schema2.message).toEqual('Value is not undefined!');

    const schema3 = undefinedAsync();
    expect(schema3.metadata).toBeUndefined();
  });
});
