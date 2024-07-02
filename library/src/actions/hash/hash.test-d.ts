import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { hash, type HashAction, type HashIssue } from './hash.ts';

describe('hash', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = HashAction<string, undefined>;
      expectTypeOf(hash(['md5'])).toEqualTypeOf<Action>();
      expectTypeOf(hash(['md5'], undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(hash(['md5'], 'message')).toEqualTypeOf<
        HashAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(hash(['md5'], () => 'message')).toEqualTypeOf<
        HashAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = HashAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<HashIssue<string>>();
    });
  });
});
