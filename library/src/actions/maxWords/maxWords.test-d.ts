import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  maxWords,
  type MaxWordsAction,
  type MaxWordsIssue,
} from './maxWords.ts';

describe('maxWords', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MaxWordsAction<string, 'en', 3, undefined>;
      expectTypeOf(maxWords<string, 'en', 3>('en', 3)).toEqualTypeOf<Action>();
      expectTypeOf(
        maxWords<string, 'en', 3, undefined>('en', 3, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        maxWords<string, 'en', 3, 'message'>('en', 3, 'message')
      ).toEqualTypeOf<MaxWordsAction<string, 'en', 3, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        maxWords<string, 'en', 3, () => string>('en', 3, () => 'message')
      ).toEqualTypeOf<MaxWordsAction<string, 'en', 3, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = 'foo bar baz';
    type Action = MaxWordsAction<Input, 'en', 3, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MaxWordsIssue<Input, 3>
      >();
    });
  });
});
