import { describe, expect, test } from 'vitest';
import {
  nullableAsync,
  objectAsync,
  string,
  stringAsync,
} from '../../schemas/index.ts';
import { fallbackAsync } from '../fallback/index.ts';
import { getFallbackAsync } from './getFallbackAsync.ts';

describe('getFallbackAsync', () => {
  test('should return undefined', async () => {
    expect(await getFallbackAsync(string())).toBeUndefined();
    expect(
      await getFallbackAsync(objectAsync({ key: string() }))
    ).toBeUndefined();
  });

  test('should return fallback value', async () => {
    expect(await getFallbackAsync(fallbackAsync(stringAsync(), 'test'))).toBe(
      'test'
    );
    expect(
      await getFallbackAsync(fallbackAsync(nullableAsync(string()), null))
    ).toBe(null);
    expect(
      await getFallbackAsync(
        fallbackAsync(objectAsync({ key: string() }), { key: 'test' })
      )
    ).toEqual({
      key: 'test',
    });
  });
});
