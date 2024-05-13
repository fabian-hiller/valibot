import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { number, object, string } from '../../schemas/index.ts';
import { fallback, fallbackAsync } from '../fallback/index.ts';
import { pipe } from '../pipe/index.ts';
import { getFallback } from './getFallback.ts';

describe('getFallback', () => {
  test('should return undefined', () => {
    expect(getFallback(string())).toBeUndefined();
    expect(getFallback(number())).toBeUndefined();
    expect(getFallback(object({}))).toBeUndefined();
  });

  describe('should return fallback fallback', () => {
    const schema = pipe(string(), transform(parseInt));

    test('for direct value', () => {
      expect(getFallback(fallback(schema, 123))).toBe(123);
      expect(getFallback(fallbackAsync(schema, 123))).toBe(123);
    });

    test('for value getter', () => {
      expect(getFallback(fallback(schema, () => 123))).toBe(123);
      expect(getFallback(fallbackAsync(schema, () => 123))).toBe(123);
    });

    test('for asycn value getter', async () => {
      expect(await getFallback(fallbackAsync(schema, async () => 123))).toBe(
        123
      );
    });
  });
});
