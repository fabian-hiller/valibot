import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { boolean, type BooleanIssue, type BooleanSchema } from './boolean.ts';

describe('boolean', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = BooleanSchema<undefined>;
      expectTypeOf(boolean()).toEqualTypeOf<Schema>();
      expectTypeOf(boolean(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(boolean('message')).toEqualTypeOf<
        BooleanSchema<'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(boolean(() => 'message')).toEqualTypeOf<
        BooleanSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = BooleanSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<boolean>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<boolean>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<BooleanIssue>();
    });
  });
});
