import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { promise, type PromiseIssue, type PromiseSchema } from './promise.ts';

describe('promise', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = PromiseSchema<undefined>;
      expectTypeOf(promise()).toEqualTypeOf<Schema>();
      expectTypeOf(promise(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(promise('message')).toEqualTypeOf<
        PromiseSchema<'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(promise(() => 'message')).toEqualTypeOf<
        PromiseSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = PromiseSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Promise<unknown>>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Promise<unknown>>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PromiseIssue>();
    });
  });
});
