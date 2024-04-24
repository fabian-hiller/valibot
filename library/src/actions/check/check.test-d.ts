import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { check, type CheckAction, type CheckIssue } from './check.ts';

describe('check', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = CheckAction<string, undefined>;
      expectTypeOf(
        check<string>((element: string) => Boolean(element))
      ).toEqualTypeOf<Action>();
      expectTypeOf(
        check<string, undefined>(
          (element: string) => Boolean(element),
          undefined
        )
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        check<string, 'message'>(
          (element: string) => Boolean(element),
          'message'
        )
      ).toEqualTypeOf<CheckAction<string, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        check<string, () => string>(
          (element: string) => Boolean(element),
          () => 'message'
        )
      ).toEqualTypeOf<CheckAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = CheckAction<Input, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<CheckIssue<Input>>();
    });
  });
});
