import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { nanAsync } from './nanAsync.ts';

describe('nanAsync', () => {
  test('should pass only NaN', async () => {
    const schema = nanAsync();
    const input = NaN;
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, '123')).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not NaN!';
    await expect(parseAsync(nanAsync(error), 123)).rejects.toThrowError(error);
  });

  test('should expose the metadata', () => {
    const schema1 = nanAsync({ description: 'NaN value' });
    expect(schema1.metadata).toEqual({ description: 'NaN value' });

    const schema2 = nanAsync({
      description: 'NaN value',
      message: 'Value is not a NaN!',
    });
    expect(schema2.metadata).toEqual({ description: 'NaN value' });
    expect(schema2.message).toEqual('Value is not a NaN!');

    const schema3 = nanAsync();
    expect(schema3.metadata).toBeUndefined();
  });
});
