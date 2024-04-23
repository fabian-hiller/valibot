import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { every, type EveryAction, type EveryIssue } from './every.ts';

describe('every', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = EveryAction<string[], undefined>;
      expectTypeOf(
        every<string[]>((element) => !!element)
      ).toEqualTypeOf<Action>();
      expectTypeOf(
        every<string[], undefined>((element) => !!element, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        every<string[], 'message'>((element) => !!element, 'message')
      ).toEqualTypeOf<EveryAction<string[], 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        every<string[], () => string>(
          (element) => !!element,
          () => 'message'
        )
      ).toEqualTypeOf<EveryAction<string[], () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = EveryAction<Input, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<EveryIssue<Input>>();
    });
  });
});
