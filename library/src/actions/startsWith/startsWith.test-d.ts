import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  startsWith,
  type StartsWithAction,
  type StartsWithIssue,
} from './startsWith.ts';

describe('startsWith', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = StartsWithAction<string, 'foo', undefined>;
      expectTypeOf(startsWith<string, 'foo'>('foo')).toEqualTypeOf<Action>();
      expectTypeOf(
        startsWith<string, 'foo', undefined>('foo', undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        startsWith<string, 'foo', 'message'>('foo', 'message')
      ).toEqualTypeOf<StartsWithAction<string, 'foo', 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        startsWith<string, 'foo', () => string>('foo', () => 'message')
      ).toEqualTypeOf<StartsWithAction<string, 'foo', () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = StartsWithAction<string, 'foo', undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        StartsWithIssue<string, 'foo'>
      >();
    });
  });
});
