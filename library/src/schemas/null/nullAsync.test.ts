import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { nullAsync } from './nullAsync.ts';

describe('nullAsync', () => {
  test('should pass only null', async () => {
    const schema = nullAsync();
    expect(await parseAsync(schema, null)).toBeNull();
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, '123')).rejects.toThrowError();
    await expect(parseAsync(schema, false)).rejects.toThrowError();
    await expect(parseAsync(schema, undefined)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not null!';
    await expect(parseAsync(nullAsync(error), 123)).rejects.toThrowError(error);
  });

  test('should expose the metadata', () => {
    const schema1 = nullAsync({ description: 'non optional value' });
    expect(schema1.metadata).toEqual({ description: 'non optional value' });

    const schema2 = nullAsync({
      description: 'non optional value',
      message: 'Value is not a optional null!',
    });
    expect(schema2.metadata).toEqual({ description: 'non optional value' });
    expect(schema2.message).toEqual('Value is not a optional null!');

    const schema3 = nullAsync();
    expect(schema3.metadata).toBeUndefined();
  });
});
