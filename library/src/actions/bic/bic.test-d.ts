import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { bic, type BicAction, type BicIssue } from './bic.ts';

describe('bic', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = BicAction<string, undefined>;
      expectTypeOf(bic<string>()).toEqualTypeOf<Action>();
      expectTypeOf(bic<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(bic<string, 'message'>('message')).toEqualTypeOf<
        BicAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(bic<string, () => string>(() => 'message')).toEqualTypeOf<
        BicAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = BicAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<BicIssue<string>>();
    });
  });
});
