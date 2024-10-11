import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  notGraphemes,
  type NotGraphemesAction,
  type NotGraphemesIssue,
} from './notGraphemes.ts';

describe('notGraphemes', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = NotGraphemesAction<string, 10, undefined>;
      expectTypeOf(notGraphemes<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        notGraphemes<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        notGraphemes<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<NotGraphemesAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        notGraphemes<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<NotGraphemesAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = 'example string';
    type Action = NotGraphemesAction<Input, 10, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        NotGraphemesIssue<Input, 10>
      >();
    });
  });
});
