import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { number, object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { parserAsync } from './parserAsync.ts';

describe('parserAsync', () => {
  const entries = {
    key: pipe(
      string(),
      transform((input) => input.length)
    ),
  };

  test('should return output for valid input', async () => {
    expect(await parserAsync(string())('hello')).toBe('hello');
    expect(await parserAsync(number())(123)).toBe(123);
    expect(await parserAsync(object(entries))({ key: 'foo' })).toStrictEqual({
      key: 3,
    });
  });

  test('should throw error for invalid input', async () => {
    await expect(() => parserAsync(string())(123)).rejects.toThrowError();
    await expect(() => parserAsync(number())('foo')).rejects.toThrowError();
    await expect(() =>
      parserAsync(object(entries))(null)
    ).rejects.toThrowError();
  });
});
