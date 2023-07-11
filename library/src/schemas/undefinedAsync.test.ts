import { describe, expect, test } from 'vitest';
import { parseAsync } from '../methods';
import { undefinedAsync } from './undefinedAsync';

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
});
