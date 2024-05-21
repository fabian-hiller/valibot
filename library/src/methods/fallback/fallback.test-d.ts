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
import { fallback, type SchemaWithFallback } from './fallback.ts';

describe('fallback', () => {
  describe('should return schema object', () => {
    const schema = pipe(number(), transform(String));
    type Schema = typeof schema;

    test('with value fallback', () => {
      expectTypeOf(fallback(schema, '123' as const)).toEqualTypeOf<
        SchemaWithFallback<Schema, '123'>
      >();
    });

    test('with function fallback', () => {
      expectTypeOf(fallback(schema, () => '123' as const)).toEqualTypeOf<
        SchemaWithFallback<Schema, () => '123'>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = SchemaWithFallback<
      SchemaWithPipe<
        [NumberSchema<undefined>, TransformAction<number, string>]
      >,
      () => '123'
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
      expectTypeOf<InferFallback<Schema>>().toEqualTypeOf<'123'>();
    });
  });
});
