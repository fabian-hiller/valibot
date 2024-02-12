import { describe, expect, test } from 'vitest';
import { number, object, string, tuple } from '../../schemas/index.ts';
import { fallback } from '../fallback/index.ts';
import { getFallbacks } from './getFallbacks.ts';

describe('getFallbacks', () => {
  test('should return undefined', () => {
    expect(getFallbacks(string())).toBeUndefined();
  });

  test('should return fallback value', () => {
    expect(getFallbacks(fallback(string(), ''))).toBe('');
    expect(getFallbacks(fallback(number(), 0))).toBe(0);
    expect(getFallbacks(fallback(string(), 'test'))).toBe('test');
    expect(
      getFallbacks(fallback(object({ key: string() }), { key: 'test' }))
    ).toEqual({
      key: 'test',
    });
  });

  test('should return object fallbacks', () => {
    expect(getFallbacks(object({}))).toEqual({});
    expect(
      getFallbacks(
        object({
          key1: string(),
          key2: fallback(string(), 'test'),
          key3: fallback(number(), 0),
          nested: object({
            key1: string(),
            key2: fallback(string(), 'test'),
            key3: fallback(number(), 0),
          }),
        })
      )
    ).toEqual({
      key1: undefined,
      key2: 'test',
      key3: 0,
      nested: {
        key1: undefined,
        key2: 'test',
        key3: 0,
      },
    });
  });

  test('should return tuple fallbacks', () => {
    expect(
      getFallbacks(
        tuple([
          string(),
          fallback(string(), 'test'),
          fallback(number(), 0),
          tuple([string(), fallback(string(), 'test'), fallback(number(), 0)]),
        ])
      )
    ).toEqual([undefined, 'test', 0, [undefined, 'test', 0]]);
  });
});
