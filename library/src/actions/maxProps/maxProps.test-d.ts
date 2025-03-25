import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  maxProps,
  type MaxPropsAction,
  type MaxPropsIssue,
} from './maxProps.ts';

describe('maxProps', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MaxPropsAction<{}, 10, undefined>;
      expectTypeOf(maxProps<{}, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        maxProps<{}, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        maxProps<{}, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MaxPropsAction<{}, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        maxProps<{}, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MaxPropsAction<{}, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MaxPropsAction<{}, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<{}>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<{}>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MaxPropsIssue<{}, 10>
      >();
    });
  });
});
