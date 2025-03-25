import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  minProps,
  type MinPropsAction,
  type MinPropsIssue,
} from './minProps.ts';

describe('minProps', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MinPropsAction<{}, 10, undefined>;
      expectTypeOf(minProps<{}, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        minProps<{}, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        minProps<{}, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MinPropsAction<{}, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        minProps<{}, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MinPropsAction<{}, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MinPropsAction<{}, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<{}>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<{}>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MinPropsIssue<{}, 10>
      >();
    });
  });
});
