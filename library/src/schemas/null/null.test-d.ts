import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { null_, type NullIssue, type NullSchema } from './null.ts';

describe('null', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NullSchema<undefined>;
      expectTypeOf(null_()).toEqualTypeOf<Schema>();
      expectTypeOf(null_(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(null_('message')).toEqualTypeOf<NullSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(null_(() => 'message')).toEqualTypeOf<
        NullSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NullSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<null>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<null>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<NullIssue>();
    });
  });
});
