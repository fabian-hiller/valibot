import { describe, expect, test } from 'vitest';
import {
  nullable,
  nullish,
  object,
  optional,
  string,
} from '../../schemas/index.ts';
import { getDefault } from './getDefault.ts';

describe('getDefault', () => {
  test('should return undefined', () => {
    expect(getDefault(string())).toBeUndefined();
    expect(getDefault(object({}))).toBeUndefined();
  });

  test('should return optional default', () => {
    expect(getDefault(optional(string()))).toBeUndefined();
    expect(getDefault(optional(string(), undefined))).toBeUndefined();
    expect(getDefault(optional(string(), () => undefined))).toBeUndefined();
    expect(getDefault(optional(string(), 'test'))).toBe('test');
    expect(getDefault(optional(string(), () => 'test'))).toBe('test');
  });

  test('should return nullable default', () => {
    expect(getDefault(nullable(string()))).toBeUndefined();
    expect(getDefault(nullable(string(), undefined))).toBeUndefined();
    expect(getDefault(nullable(string(), () => undefined))).toBeUndefined();
    expect(getDefault(nullable(string(), 'test'))).toBe('test');
    expect(getDefault(nullable(string(), () => 'test'))).toBe('test');
  });

  test('should return nullish default', () => {
    expect(getDefault(nullish(string()))).toBeUndefined();
    expect(getDefault(nullish(string(), undefined))).toBeUndefined();
    expect(getDefault(nullish(string(), () => undefined))).toBeUndefined();
    expect(getDefault(nullish(string(), 'test'))).toBe('test');
    expect(getDefault(nullish(string(), () => 'test'))).toBe('test');
  });
});
