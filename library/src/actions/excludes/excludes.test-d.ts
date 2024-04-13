import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  excludes,
  type ExcludesAction,
  type ExcludesIssue,
} from './excludes.ts';

describe('excludes', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = ExcludesAction<string, 'foo', undefined>;
      expectTypeOf(excludes<string, 'foo'>('foo')).toEqualTypeOf<Action>();
      expectTypeOf(
        excludes<string, 'foo', undefined>('foo', undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        excludes<string, 'foo', 'message'>('foo', 'message')
      ).toEqualTypeOf<ExcludesAction<string, 'foo', 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        excludes<string, 'foo', () => string>('foo', () => 'message')
      ).toEqualTypeOf<ExcludesAction<string, 'foo', () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = ExcludesAction<Input, 'foo', undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        ExcludesIssue<Input, 'foo'>
      >();
    });
  });
});
