import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  minWords,
  type MinWordsAction,
  type MinWordsIssue,
} from './minWords.ts';

describe('minWords', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MinWordsAction<string, 'en', 3, undefined>;
      expectTypeOf(minWords<string, 'en', 3>('en', 3)).toEqualTypeOf<Action>();
      expectTypeOf(
        minWords<string, 'en', 3, undefined>('en', 3, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        minWords<string, 'en', 3, 'message'>('en', 3, 'message')
      ).toEqualTypeOf<MinWordsAction<string, 'en', 3, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        minWords<string, 'en', 3, () => string>('en', 3, () => 'message')
      ).toEqualTypeOf<MinWordsAction<string, 'en', 3, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = 'foo bar baz';
    type Action = MinWordsAction<Input, 'en', 3, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MinWordsIssue<Input, 3>
      >();
    });
  });
});
