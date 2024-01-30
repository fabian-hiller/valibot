import { describe, expect, test } from 'vitest';
import {
  nullable,
  nullish,
  number,
  object,
  optional,
  string,
  tuple,
} from '../../schemas/index.ts';
import { getDefaults } from './getDefaults.ts';

describe('getDefaults', () => {
  test('should return undefined', () => {
    expect(getDefaults(string())).toBeUndefined();
    expect(getDefaults(optional(string()))).toBeUndefined();
    expect(getDefaults(nullable(string()))).toBeUndefined();
    expect(getDefaults(nullish(string()))).toBeUndefined();
  });

  test('should return default value', () => {
    expect(getDefaults(optional(string(), ''))).toBe('');
    expect(getDefaults(nullable(string(), ''))).toBe('');
    expect(getDefaults(nullish(string(), ''))).toBe('');
    expect(getDefaults(optional(number(), 0))).toBe(0);
    expect(getDefaults(nullable(number(), 0))).toBe(0);
    expect(getDefaults(nullish(number(), 0))).toBe(0);
    expect(getDefaults(optional(string(), 'test'))).toBe('test');
    expect(getDefaults(nullable(string(), 'test'))).toBe('test');
    expect(getDefaults(nullish(string(), 'test'))).toBe('test');
  });

  test('should return object defaults', () => {
    expect(getDefaults(object({}))).toEqual({});
    expect(
      getDefaults(
        object({
          key1: string(),
          key2: optional(string(), 'test'),
          key3: optional(number(), 0),
          nested: object({
            key1: string(),
            key2: optional(string(), 'test'),
            key3: optional(number(), 0),
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

  test('should return tuple defaults', () => {
    expect(
      getDefaults(
        tuple([
          string(),
          optional(string(), 'test'),
          optional(number(), 0),
          tuple([string(), optional(string(), 'test'), optional(number(), 0)]),
        ])
      )
    ).toEqual([undefined, 'test', 0, [undefined, 'test', 0]]);
  });
});
