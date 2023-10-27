import { describe, expect, test } from 'vitest';
import { object, optional, string, tuple } from '../../schemas/index.ts';
import { getFallbacks } from './getFallbacks.ts';
import { fallback } from '../fallback/index.ts';

describe('getFallbacks', () => {
  test('should return undefined', () => {
    expect(getFallbacks(string())).toBeUndefined();
    expect(getFallbacks(optional(string()))).toBeUndefined();
  });

  test('should return fallback value', () => {
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
          nested: object({
            key1: string(),
            key2: fallback(string(), 'test'),
          }),
        })
      )
    ).toEqual({
      key1: undefined,
      key2: 'test',
      nested: {
        key1: undefined,
        key2: 'test',
      },
    });
  });

  test('should return tuple fallbacks', () => {
    expect(
      getFallbacks(
        tuple([
          string(),
          fallback(string(), 'test'),
          tuple([string(), fallback(string(), 'test')]),
        ])
      )
    ).toEqual([undefined, 'test', [undefined, 'test']]);
  });
});
