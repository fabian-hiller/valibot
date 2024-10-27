import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { words, type WordsAction, type WordsIssue } from './words.ts';

describe('words', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = WordsAction<string, 'en', 3, undefined>;
      expectTypeOf(words<string, 'en', 3>('en', 3)).toEqualTypeOf<Action>();
      expectTypeOf(
        words<string, 'en', 3, undefined>('en', 3, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        words<string, 'en', 3, 'message'>('en', 3, 'message')
      ).toEqualTypeOf<WordsAction<string, 'en', 3, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        words<string, 'en', 3, () => string>('en', 3, () => 'message')
      ).toEqualTypeOf<WordsAction<string, 'en', 3, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = 'foo bar baz';
    type Action = WordsAction<Input, 'en', 3, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<WordsIssue<Input, 3>>();
    });
  });
});
