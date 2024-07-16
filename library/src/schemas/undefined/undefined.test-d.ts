import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  undefined_,
  type UndefinedIssue,
  type UndefinedSchema,
} from './undefined.ts';

describe('undefined', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = UndefinedSchema<undefined>;
      expectTypeOf(undefined_()).toEqualTypeOf<Schema>();
      expectTypeOf(undefined_(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(undefined_('message')).toEqualTypeOf<
        UndefinedSchema<'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(undefined_(() => 'message')).toEqualTypeOf<
        UndefinedSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = UndefinedSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<undefined>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<undefined>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<UndefinedIssue>();
    });
  });
});
