import { describe, expect, test } from 'vitest';
import {
  nullableAsync,
  nullishAsync,
  objectAsync,
  optionalAsync,
  string,
} from '../../schemas/index.ts';
import { getDefaultAsync } from './getDefaultAsync.ts';

describe('getDefaultAsync', () => {
  test('should return undefined', async () => {
    expect(await getDefaultAsync(string())).toBeUndefined();
    expect(await getDefaultAsync(objectAsync({}))).toBeUndefined();
  });

  test('should return optional default', async () => {
    expect(await getDefaultAsync(optionalAsync(string()))).toBeUndefined();
    expect(
      await getDefaultAsync(optionalAsync(string(), undefined))
    ).toBeUndefined();
    expect(
      await getDefaultAsync(optionalAsync(string(), () => undefined))
    ).toBeUndefined();
    expect(
      await getDefaultAsync(optionalAsync(string(), async () => undefined))
    ).toBeUndefined();
    expect(await getDefaultAsync(optionalAsync(string(), 'test'))).toBe('test');
    expect(await getDefaultAsync(optionalAsync(string(), () => 'test'))).toBe(
      'test'
    );
    expect(
      await getDefaultAsync(optionalAsync(string(), async () => 'test'))
    ).toBe('test');
  });

  test('should return nullable default', async () => {
    expect(await getDefaultAsync(nullableAsync(string()))).toBeUndefined();
    expect(
      await getDefaultAsync(nullableAsync(string(), undefined))
    ).toBeUndefined();
    expect(
      await getDefaultAsync(nullableAsync(string(), () => undefined))
    ).toBeUndefined();
    expect(
      await getDefaultAsync(nullableAsync(string(), async () => undefined))
    ).toBeUndefined();
    expect(await getDefaultAsync(nullableAsync(string(), 'test'))).toBe('test');
    expect(await getDefaultAsync(nullableAsync(string(), () => 'test'))).toBe(
      'test'
    );
    expect(
      await getDefaultAsync(nullableAsync(string(), async () => 'test'))
    ).toBe('test');
  });

  test('should return nullish default', async () => {
    expect(await getDefaultAsync(nullishAsync(string()))).toBeUndefined();
    expect(
      await getDefaultAsync(nullishAsync(string(), undefined))
    ).toBeUndefined();
    expect(
      await getDefaultAsync(nullishAsync(string(), () => undefined))
    ).toBeUndefined();
    expect(
      await getDefaultAsync(nullishAsync(string(), async () => undefined))
    ).toBeUndefined();
    expect(await getDefaultAsync(nullishAsync(string(), 'test'))).toBe('test');
    expect(await getDefaultAsync(nullishAsync(string(), () => 'test'))).toBe(
      'test'
    );
    expect(
      await getDefaultAsync(nullishAsync(string(), async () => 'test'))
    ).toBe('test');
  });
});
