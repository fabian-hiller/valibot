import { describe, expect, test } from 'vitest';
import {
  exactOptional,
  exactOptionalAsync,
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
  undefinedable,
  undefinedableAsync,
} from '../../schemas/index.ts';
import { fallback, fallbackAsync } from '../fallback/index.ts';
import { pipe, pipeAsync } from '../pipe/index.ts';
import { unwrap } from './unwrap.ts';

describe('unwrap', () => {
  const wrapped = string();

  test('should unwrap exactOptional', () => {
    expect(unwrap(exactOptional(wrapped))).toBe(wrapped);
  });

  test('should unwrap exactOptionalAsync', () => {
    expect(unwrap(exactOptionalAsync(wrapped))).toBe(wrapped);
  });

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

  test('should unwrap undefinedable', () => {
    expect(unwrap(undefinedable(wrapped))).toBe(wrapped);
  });

  test('should unwrap undefinedableAsync', () => {
    expect(unwrap(undefinedableAsync(wrapped))).toBe(wrapped);
  });

  test('should unwrap schema with pipe', () => {
    expect(unwrap(pipe(optional(wrapped)))).toBe(wrapped);
    expect(unwrap(pipeAsync(optional(wrapped)))).toBe(wrapped);
    expect(unwrap(pipeAsync(optionalAsync(wrapped)))).toBe(wrapped);
  });

  test('should unwrap schema with fallback', () => {
    expect(unwrap(fallback(optional(wrapped), 'foo'))).toBe(wrapped);
    expect(unwrap(fallbackAsync(optional(wrapped), 'foo'))).toBe(wrapped);
    expect(unwrap(fallbackAsync(optionalAsync(wrapped), 'foo'))).toBe(wrapped);
  });
});
