import { describe, expectTypeOf, test } from 'vitest';
import { transform, type TransformAction } from '../../actions/index.ts';
import {
  number,
  type NumberIssue,
  type NumberSchema,
} from '../../schemas/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { InferFallback } from '../getFallback/index.ts';
import { pipe, type SchemaWithPipe } from '../pipe/index.ts';
import {
  fallbackAsync,
  type SchemaWithFallbackAsync,
} from './fallbackAsync.ts';

describe('fallbackAsync', () => {
  describe('should return schema object', () => {
    const schema = pipe(number(), transform(String));
    type Schema = typeof schema;

    test('with value fallback', () => {
      expectTypeOf(fallbackAsync(schema, '123' as const)).toEqualTypeOf<
        SchemaWithFallbackAsync<Schema, '123'>
      >();
    });

    test('with function fallback', () => {
      expectTypeOf(fallbackAsync(schema, () => '123' as const)).toEqualTypeOf<
        SchemaWithFallbackAsync<Schema, () => '123'>
      >();
    });

    test('with async function fallback', () => {
      expectTypeOf(
        fallbackAsync(schema, async () => '123' as const)
      ).toEqualTypeOf<SchemaWithFallbackAsync<Schema, () => Promise<'123'>>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = SchemaWithFallbackAsync<
      SchemaWithPipe<
        [NumberSchema<undefined>, TransformAction<number, string>]
      >,
      () => Promise<'123'>
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<number>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<NumberIssue>();
    });

    test('of fallback', () => {
      expectTypeOf<InferFallback<Schema>>().toEqualTypeOf<Promise<'123'>>();
    });
  });
});
