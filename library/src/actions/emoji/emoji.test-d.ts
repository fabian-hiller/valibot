import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { emoji, type EmojiAction, type EmojiIssue } from './emoji.ts';

describe('emoji', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = EmojiAction<string, undefined>;
      expectTypeOf(emoji()).toEqualTypeOf<Action>();
      expectTypeOf(emoji(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(emoji('message')).toEqualTypeOf<
        EmojiAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(emoji(() => 'message')).toEqualTypeOf<
        EmojiAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = EmojiAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<EmojiIssue<string>>();
    });
  });
});
