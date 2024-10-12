import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  notWords,
  type NotWordsAction,
  type NotWordsIssue,
} from './notWords.ts';

describe('notWords', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = NotWordsAction<string, 'en', 3, undefined>;
      expectTypeOf(notWords<string, 'en', 3>('en', 3)).toEqualTypeOf<Action>();
      expectTypeOf(
        notWords<string, 'en', 3, undefined>('en', 3, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        notWords<string, 'en', 3, 'message'>('en', 3, 'message')
      ).toEqualTypeOf<NotWordsAction<string, 'en', 3, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        notWords<string, 'en', 3, () => string>('en', 3, () => 'message')
      ).toEqualTypeOf<NotWordsAction<string, 'en', 3, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = 'foo bar baz';
    type Action = NotWordsAction<Input, 'en', 3, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        NotWordsIssue<Input, 3>
      >();
    });
  });
});
