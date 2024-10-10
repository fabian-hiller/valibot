import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  maxGraphemes,
  type MaxGraphemesAction,
  type MaxGraphemesIssue,
} from './maxGraphemes.ts';

describe('maxGraphemes', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MaxGraphemesAction<string, 10, undefined>;
      expectTypeOf(maxGraphemes<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        maxGraphemes<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        maxGraphemes<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MaxGraphemesAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        maxGraphemes<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MaxGraphemesAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = MaxGraphemesAction<string, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MaxGraphemesIssue<string, 10>
      >();
    });
  });
});
