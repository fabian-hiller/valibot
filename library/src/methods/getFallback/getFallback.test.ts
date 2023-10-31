import { describe, expect, test } from 'vitest';
import { nullable, object, string } from '../../schemas/index.ts';
import { fallback } from '../fallback/index.ts';
import { getFallback } from './getFallback.ts';

describe('getFallback', () => {
  test('should return undefined', () => {
    expect(getFallback(string())).toBeUndefined();
    expect(getFallback(object({ key: string() }))).toBeUndefined();
  });

  test('should return fallback value', () => {
    expect(getFallback(fallback(string(), 'test'))).toBe('test');
    expect(getFallback(fallback(nullable(string()), null))).toBe(null);
    expect(
      getFallback(fallback(object({ key: string() }), { key: 'test' }))
    ).toEqual({
      key: 'test',
    });
  });
});
