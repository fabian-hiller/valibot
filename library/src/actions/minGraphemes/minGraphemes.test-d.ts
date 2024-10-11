import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  minGraphemes,
  type MinGraphemesAction,
  type MinGraphemesIssue,
} from './minGraphemes.ts';

describe('minGraphemes', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MinGraphemesAction<string, 10, undefined>;
      expectTypeOf(minGraphemes<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        minGraphemes<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        minGraphemes<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<MinGraphemesAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        minGraphemes<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<MinGraphemesAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = 'example string';
    type Action = MinGraphemesAction<Input, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MinGraphemesIssue<Input, 10>
      >();
    });
  });
});
