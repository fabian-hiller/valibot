import { describe, expect, test } from 'vitest';
import {
  nonNullable,
  nonNullableAsync,
  nonNullish,
  nonNullishAsync,
  nonOptional,
  nonOptionalAsync,
  nullable,
  nullableAsync,
  nullish,
  nullishAsync,
  optional,
  optionalAsync,
  string,
} from '../../schemas/index.ts';
import { unwrap } from './unwrap.ts';

describe('unwrap', () => {
  const wrapped = string();

  test('should unwrap nonNullable', () => {
    expect(unwrap(nonNullable(wrapped))).toBe(wrapped);
  });

  test('should unwrap nonNullableAsync', () => {
    expect(unwrap(nonNullableAsync(wrapped))).toBe(wrapped);
  });

  test('should unwrap nonNullish', () => {
    expect(unwrap(nonNullish(wrapped))).toBe(wrapped);
  });

  test('should unwrap nonNullishAsync', () => {
    expect(unwrap(nonNullishAsync(wrapped))).toBe(wrapped);
  });

  test('should unwrap nonOptional', () => {
    expect(unwrap(nonOptional(wrapped))).toBe(wrapped);
  });

  test('should unwrap nonOptionalAsync', () => {
    expect(unwrap(nonOptionalAsync(wrapped))).toBe(wrapped);
  });

  test('should unwrap nullable', () => {
    expect(unwrap(nullable(wrapped))).toBe(wrapped);
  });

  test('should unwrap nullableAsync', () => {
    expect(unwrap(nullableAsync(wrapped))).toBe(wrapped);
  });

  test('should unwrap nullish', () => {
    expect(unwrap(nullish(wrapped))).toBe(wrapped);
  });

  test('should unwrap nullishAsync', () => {
    expect(unwrap(nullishAsync(wrapped))).toBe(wrapped);
  });

  test('should unwrap optional', () => {
    expect(unwrap(optional(wrapped))).toBe(wrapped);
  });

  test('should unwrap optionalAsync', () => {
    expect(unwrap(optionalAsync(wrapped))).toBe(wrapped);
  });
});
