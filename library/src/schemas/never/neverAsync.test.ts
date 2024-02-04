import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { neverAsync } from './neverAsync.ts';

describe('neverAsync', () => {
  test('should pass no value', async () => {
    const schema = neverAsync();
    await expect(parseAsync(schema, null)).rejects.toThrowError();
    await expect(parseAsync(schema, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not never!';
    await expect(parseAsync(neverAsync(error), undefined)).rejects.toThrowError(
      error
    );
  });

  test('should expose the metadata', () => {
    const schema1 = neverAsync({ description: 'never value' });
    expect(schema1.metadata).toEqual({ description: 'never value' });

    const schema2 = neverAsync({
      description: 'never value',
      message: 'Value is not a never!',
    });
    expect(schema2.metadata).toEqual({ description: 'never value' });
    expect(schema2.message).toEqual('Value is not a never!');

    const schema3 = neverAsync();
    expect(schema3.metadata).toBeUndefined();
  });
});
