import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { literal, type LiteralIssue, type LiteralSchema } from './literal.ts';

describe('literal', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = LiteralSchema<'foo', undefined>;
      expectTypeOf(literal('foo')).toEqualTypeOf<Schema>();
      expectTypeOf(literal('foo', undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(literal(123, 'message')).toEqualTypeOf<
        LiteralSchema<123, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(literal(true, () => 'message')).toEqualTypeOf<
        LiteralSchema<true, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = LiteralSchema<'foo', undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<'foo'>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<'foo'>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<LiteralIssue>();
    });
  });
});
