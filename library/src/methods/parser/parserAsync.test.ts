import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { number, objectAsync, string } from '../../schemas/index.ts';
import type { Config, InferIssue } from '../../types/index.ts';
import { pipe } from '../pipe/index.ts';
import { parserAsync } from './parserAsync.ts';

describe('parserAsync', () => {
  const entries = {
    key: pipe(
      string(),
      transform((input) => input.length)
    ),
  };

  describe('should return function object', () => {
    const schema = objectAsync(entries);

    test('without config', () => {
      const func1 = parserAsync(schema);
      expect(func1).toBeInstanceOf(Function);
      expect(func1.schema).toBe(schema);
      expect(func1.config).toBeUndefined();
      const func2 = parserAsync(schema, undefined);
      expect(func2).toBeInstanceOf(Function);
      expect(func2.schema).toBe(schema);
      expect(func2.config).toBeUndefined();
    });

    test('with config', () => {
      const config: Omit<Config<InferIssue<typeof schema>>, 'skipPipe'> = {
        abortEarly: true,
      };
      const func = parserAsync(schema, config);
      expect(func).toBeInstanceOf(Function);
      expect(func.schema).toBe(schema);
      expect(func.config).toBe(config);
    });
  });

  test('should return output for valid input', async () => {
    expect(await parserAsync(string())('hello')).toBe('hello');
    expect(await parserAsync(number())(123)).toBe(123);
    expect(
      await parserAsync(objectAsync(entries))({ key: 'foo' })
    ).toStrictEqual({
      key: 3,
    });
  });

  test('should throw error for invalid input', async () => {
    await expect(() => parserAsync(string())(123)).rejects.toThrowError();
    await expect(() => parserAsync(number())('foo')).rejects.toThrowError();
    await expect(() =>
      parserAsync(objectAsync(entries))(null)
    ).rejects.toThrowError();
  });
});
