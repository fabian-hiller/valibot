import { describe, expect, test } from 'vitest';
import {
  nullable,
  nullableAsync,
  nullish,
  nullishAsync,
  optional,
  optionalAsync,
  string,
} from '../../schemas/index.ts';
import { getDefault } from './getDefault.ts';

describe('getDefault', () => {
  test('should return optional default', async () => {
    expect(getDefault(optional(string()))).toBeUndefined();
    expect(getDefault(optional(string(), undefined))).toBeUndefined();
    expect(getDefault(optional(string(), () => undefined))).toBeUndefined();
    expect(getDefault(optional(string(), 'test'))).toBe('test');
    expect(getDefault(optional(string(), () => 'test'))).toBe('test');

    expect(getDefault(optionalAsync(string()))).toBeUndefined();
    expect(getDefault(optionalAsync(string(), undefined))).toBeUndefined();
    expect(
      getDefault(optionalAsync(string(), () => undefined))
    ).toBeUndefined();
    expect(
      await getDefault(optionalAsync(string(), async () => undefined))
    ).toBeUndefined();
    expect(getDefault(optionalAsync(string(), 'test'))).toBe('test');
    expect(getDefault(optionalAsync(string(), () => 'test'))).toBe('test');
    expect(await getDefault(optionalAsync(string(), async () => 'test'))).toBe(
      'test'
    );
  });

  test('should return nullable default', async () => {
    expect(getDefault(nullable(string()))).toBeUndefined();
    expect(getDefault(nullable(string(), undefined))).toBeUndefined();
    expect(getDefault(nullable(string(), () => undefined))).toBeUndefined();
    expect(getDefault(nullable(string(), 'test'))).toBe('test');
    expect(getDefault(nullable(string(), () => 'test'))).toBe('test');

    expect(getDefault(nullableAsync(string()))).toBeUndefined();
    expect(getDefault(nullableAsync(string(), undefined))).toBeUndefined();
    expect(
      getDefault(nullableAsync(string(), () => undefined))
    ).toBeUndefined();
    expect(
      await getDefault(nullableAsync(string(), async () => undefined))
    ).toBeUndefined();
    expect(getDefault(nullableAsync(string(), 'test'))).toBe('test');
    expect(getDefault(nullableAsync(string(), () => 'test'))).toBe('test');
    expect(await getDefault(nullableAsync(string(), async () => 'test'))).toBe(
      'test'
    );
  });

  test('should return nullish default', async () => {
    expect(getDefault(nullish(string()))).toBeUndefined();
    expect(getDefault(nullish(string(), undefined))).toBeUndefined();
    expect(getDefault(nullish(string(), () => undefined))).toBeUndefined();
    expect(getDefault(nullish(string(), 'test'))).toBe('test');
    expect(getDefault(nullish(string(), () => 'test'))).toBe('test');

    expect(getDefault(nullishAsync(string()))).toBeUndefined();
    expect(getDefault(nullishAsync(string(), undefined))).toBeUndefined();
    expect(getDefault(nullishAsync(string(), () => undefined))).toBeUndefined();
    expect(
      await getDefault(nullishAsync(string(), async () => undefined))
    ).toBeUndefined();
    expect(getDefault(nullishAsync(string(), 'test'))).toBe('test');
    expect(getDefault(nullishAsync(string(), () => 'test'))).toBe('test');
    expect(await getDefault(nullishAsync(string(), async () => 'test'))).toBe(
      'test'
    );
  });
});
