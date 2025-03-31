import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  maxProps,
  type MaxPropsAction,
  type MaxPropsIssue,
} from './maxProps.ts';

describe('maxProps', () => {
  type Input = Record<string, number>;

  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MaxPropsAction<Input, 10, undefined>;
      expectTypeOf(maxProps<Input, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        maxProps<Input, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(maxProps<Input, 10, 'message'>(10, 'message')).toEqualTypeOf<
        MaxPropsAction<Input, 10, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        maxProps<Input, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MaxPropsAction<Input, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MaxPropsAction<Input, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MaxPropsIssue<Input, 10>
      >();
    });
  });
});
