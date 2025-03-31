import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  minProps,
  type MinPropsAction,
  type MinPropsIssue,
} from './minProps.ts';

describe('minProps', () => {
  type Input = Record<string, number>;

  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MinPropsAction<Input, 10, undefined>;
      expectTypeOf(minProps<Input, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        minProps<Input, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(minProps<Input, 10, 'message'>(10, 'message')).toEqualTypeOf<
        MinPropsAction<Input, 10, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        minProps<Input, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MinPropsAction<Input, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MinPropsAction<Input, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MinPropsIssue<Input, 10>
      >();
    });
  });
});
