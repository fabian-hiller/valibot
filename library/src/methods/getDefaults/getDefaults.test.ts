import { describe, expect, test } from 'vitest';
import {
  nullable,
  nullish,
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
          nested: object({
            key1: string(),
            key2: optional(string(), 'test'),
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

  test('should return tuple defaults', () => {
    expect(
      getDefaults(
        tuple([
          string(),
          optional(string(), 'test'),
          tuple([string(), optional(string(), 'test')]),
        ])
      )
    ).toEqual([undefined, 'test', [undefined, 'test']]);
  });
});
