import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { nan, type NanIssue, type NanSchema } from './nan.ts';

describe('nan', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NanSchema<undefined>;
      expectTypeOf(nan()).toEqualTypeOf<Schema>();
      expectTypeOf(nan(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(nan('message')).toEqualTypeOf<NanSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(nan(() => 'message')).toEqualTypeOf<
        NanSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NanSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<number>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<number>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<NanIssue>();
    });
  });
});
