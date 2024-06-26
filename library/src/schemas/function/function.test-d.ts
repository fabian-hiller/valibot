import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  function_,
  type FunctionIssue,
  type FunctionSchema,
} from './function.ts';

describe('function', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = FunctionSchema<undefined>;
      expectTypeOf(function_()).toEqualTypeOf<Schema>();
      expectTypeOf(function_(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(function_('message')).toEqualTypeOf<
        FunctionSchema<'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(function_(() => 'message')).toEqualTypeOf<
        FunctionSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = FunctionSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        (...args: unknown[]) => unknown
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        (...args: unknown[]) => unknown
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<FunctionIssue>();
    });
  });
});
