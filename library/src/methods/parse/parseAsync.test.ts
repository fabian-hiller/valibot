import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { number, object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { parseAsync } from './parseAsync.ts';

describe('parseAsync', () => {
  const entries = {
    key: pipe(
      string(),
      transform((input) => input.length)
    ),
  };

  test('should return output for valid input', async () => {
    expect(await parseAsync(string(), 'hello')).toBe('hello');
    expect(await parseAsync(number(), 123)).toBe(123);
    expect(await parseAsync(object(entries), { key: 'foo' })).toStrictEqual({
      key: 3,
    });
  });

  test('should throw error for invalid input', async () => {
    await expect(() => parseAsync(string(), 123)).rejects.toThrowError();
    await expect(() => parseAsync(number(), 'foo')).rejects.toThrowError();
    await expect(() =>
      parseAsync(object(entries), null)
    ).rejects.toThrowError();
  });
});
