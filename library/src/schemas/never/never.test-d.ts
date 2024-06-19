import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { never, type NeverIssue, type NeverSchema } from './never.ts';

describe('never', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NeverSchema<undefined>;
      expectTypeOf(never()).toEqualTypeOf<Schema>();
      expectTypeOf(never(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(never('message')).toEqualTypeOf<NeverSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(never(() => 'message')).toEqualTypeOf<
        NeverSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NeverSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<never>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<never>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<NeverIssue>();
    });
  });
});
