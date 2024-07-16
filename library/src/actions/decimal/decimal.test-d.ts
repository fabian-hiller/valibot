import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { decimal, type DecimalAction, type DecimalIssue } from './decimal.ts';

describe('decimal', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = DecimalAction<string, undefined>;
      expectTypeOf(decimal()).toEqualTypeOf<Action>();
      expectTypeOf(decimal(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(decimal('message')).toEqualTypeOf<
        DecimalAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(decimal(() => 'message')).toEqualTypeOf<
        DecimalAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = DecimalAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<DecimalIssue<string>>();
    });
  });
});
