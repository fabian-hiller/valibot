import { describe, expectTypeOf, test } from 'vitest';
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
  type Wrapped = typeof wrapped;

  test('should unwrap exactOptional', () => {
    expectTypeOf(unwrap(exactOptional(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap exactOptionalAsync', () => {
    expectTypeOf(unwrap(exactOptionalAsync(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap nonNullable', () => {
    expectTypeOf(unwrap(nonNullable(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap nonNullableAsync', () => {
    expectTypeOf(unwrap(nonNullableAsync(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap nonNullish', () => {
    expectTypeOf(unwrap(nonNullish(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap nonNullishAsync', () => {
    expectTypeOf(unwrap(nonNullishAsync(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap nonOptional', () => {
    expectTypeOf(unwrap(nonOptional(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap nonOptionalAsync', () => {
    expectTypeOf(unwrap(nonOptionalAsync(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap nullable', () => {
    expectTypeOf(unwrap(nullable(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap nullableAsync', () => {
    expectTypeOf(unwrap(nullableAsync(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap nullish', () => {
    expectTypeOf(unwrap(nullish(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap nullishAsync', () => {
    expectTypeOf(unwrap(nullishAsync(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap optional', () => {
    expectTypeOf(unwrap(optional(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap optionalAsync', () => {
    expectTypeOf(unwrap(optionalAsync(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap undefinedable', () => {
    expectTypeOf(unwrap(undefinedable(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap undefinedableAsync', () => {
    expectTypeOf(unwrap(undefinedableAsync(wrapped))).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap schema with pipe', () => {
    expectTypeOf(unwrap(pipe(optional(wrapped)))).toEqualTypeOf<Wrapped>();
    expectTypeOf(unwrap(pipeAsync(optional(wrapped)))).toEqualTypeOf<Wrapped>();
    expectTypeOf(
      unwrap(pipeAsync(optionalAsync(wrapped)))
    ).toEqualTypeOf<Wrapped>();
  });

  test('should unwrap schema with fallback', () => {
    expectTypeOf(
      unwrap(fallback(optional(wrapped), 'foo'))
    ).toEqualTypeOf<Wrapped>();
    expectTypeOf(
      unwrap(fallbackAsync(optional(wrapped), 'foo'))
    ).toEqualTypeOf<Wrapped>();
    expectTypeOf(
      unwrap(fallbackAsync(optionalAsync(wrapped), 'foo'))
    ).toEqualTypeOf<Wrapped>();
  });
});
