import { describe, expect, test } from 'vitest';
import { parseAsync } from '../methods';
import { symbolAsync } from './symbolAsync';

describe('symbolAsync', () => {
  test('should pass only symbols', async () => {
    const schema = symbolAsync();
    const input = Symbol('hello');
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema, null)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a symbol!';
    await expect(parseAsync(symbolAsync(error), 123)).rejects.toThrowError(
      error
    );
  });
});
