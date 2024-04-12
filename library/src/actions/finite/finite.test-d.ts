import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { finite, type FiniteAction, type FiniteIssue } from './finite.ts';

describe('finite', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = FiniteAction<number, undefined>;
      expectTypeOf(finite()).toEqualTypeOf<Action>();
      expectTypeOf(finite(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(finite('message')).toEqualTypeOf<
        FiniteAction<number, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(finite(() => 'message')).toEqualTypeOf<
        FiniteAction<number, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Input = 1 | 2 | 3;
    type Action = FiniteAction<Input, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<FiniteIssue<Input>>();
    });
  });
});
