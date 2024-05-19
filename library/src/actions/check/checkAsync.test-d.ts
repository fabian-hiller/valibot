import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { type CheckActionAsync, checkAsync } from './checkAsync.ts';
import type { CheckIssue } from './types.ts';

describe('checkAsync', () => {
  describe('should return action object', () => {
    const requirement = async (input: string) => Boolean(input);

    test('with undefined message', () => {
      type Action = CheckActionAsync<string, undefined>;
      expectTypeOf(checkAsync<string>(requirement)).toEqualTypeOf<Action>();
      expectTypeOf(
        checkAsync<string, undefined>(requirement, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        checkAsync<string, 'message'>(requirement, 'message')
      ).toEqualTypeOf<CheckActionAsync<string, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        checkAsync<string, () => string>(requirement, () => 'message')
      ).toEqualTypeOf<CheckActionAsync<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = CheckActionAsync<Input, undefined>;

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
