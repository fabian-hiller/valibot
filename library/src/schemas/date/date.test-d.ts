import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { date, type DateIssue, type DateSchema } from './date.ts';

describe('date', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = DateSchema<undefined>;
      expectTypeOf(date()).toEqualTypeOf<Schema>();
      expectTypeOf(date(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(date('message')).toEqualTypeOf<DateSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(date(() => 'message')).toEqualTypeOf<
        DateSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = DateSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Date>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Date>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<DateIssue>();
    });
  });
});
