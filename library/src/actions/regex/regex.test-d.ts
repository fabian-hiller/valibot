import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { regex, type RegexAction, type RegexIssue } from './regex.ts';

describe('regex', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = RegexAction<string, undefined>;
      expectTypeOf(regex<string>(/^ID-\d{3}$/u)).toEqualTypeOf<Action>();
      expectTypeOf(
        regex<string, undefined>(/^ID-\d{3}$/u, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        regex<string, 'message'>(/^ID-\d{3}$/u, 'message')
      ).toEqualTypeOf<RegexAction<string, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        regex<string, () => string>(/^ID-\d{3}$/u, () => 'message')
      ).toEqualTypeOf<RegexAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = RegexAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<RegexIssue<string>>();
    });
  });
});
