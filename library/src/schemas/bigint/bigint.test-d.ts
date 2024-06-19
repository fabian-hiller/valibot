import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { bigint, type BigintIssue, type BigintSchema } from './bigint.ts';

describe('bigint', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = BigintSchema<undefined>;
      expectTypeOf(bigint()).toEqualTypeOf<Schema>();
      expectTypeOf(bigint(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(bigint('message')).toEqualTypeOf<BigintSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(bigint(() => 'message')).toEqualTypeOf<
        BigintSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = BigintSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<bigint>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<bigint>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<BigintIssue>();
    });
  });
});
