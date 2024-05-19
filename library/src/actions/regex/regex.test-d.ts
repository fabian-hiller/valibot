import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { regex, type RegexAction, type RegexIssue } from './regex.ts';

describe('regex', () => {
  describe('should return action object', () => {
    const requirement = /^ID-\d{3}$/u;

    test('with undefined message', () => {
      type Action = RegexAction<string, undefined>;
      expectTypeOf(regex<string>(requirement)).toEqualTypeOf<Action>();
      expectTypeOf(
        regex<string, undefined>(requirement, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        regex<string, 'message'>(requirement, 'message')
      ).toEqualTypeOf<RegexAction<string, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        regex<string, () => string>(requirement, () => 'message')
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
