import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { number, type NumberIssue, type NumberSchema } from './number.ts';

describe('number', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NumberSchema<undefined>;
      expectTypeOf(number()).toEqualTypeOf<Schema>();
      expectTypeOf(number(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(number('message')).toEqualTypeOf<NumberSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(number(() => 'message')).toEqualTypeOf<
        NumberSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NumberSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<number>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<number>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<NumberIssue>();
    });
  });
});
