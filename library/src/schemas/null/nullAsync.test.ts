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
});
