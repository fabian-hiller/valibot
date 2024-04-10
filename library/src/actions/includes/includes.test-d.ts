import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { 
  includes, 
  type IncludesAction,
  type IncludesIssue 
} from './includes.ts';

describe('includes', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IncludesAction<string, "hello", undefined>;
      expectTypeOf(includes<string, "hello">("hello")).toEqualTypeOf<Action>();
      expectTypeOf(
        includes<string, "hello", undefined>("hello", undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        includes<string, "hello", 'message'>("hello", 'message')
      ).toEqualTypeOf<IncludesAction<string, "hello", 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        includes<string, "hello", () => string>("hello", () => 'message')
      ).toEqualTypeOf<IncludesAction<string, "hello", () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = IncludesAction<string, "hello", undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        IncludesIssue<string, "hello">
      >();
    });
  });

  describe('should correctly relate input and requirement types', () => {
    describe('when the input is a string', () => {
      test('and the requirement is not a valid related type', () => {
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type Action = IncludesAction<string, number, undefined>;
      });

      test('and the requirement is a valid related type', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type Action = IncludesAction<string, string, undefined>;
      });
    });

    describe('when the input is an array', () => {
      test('and the requirement is not a valid related type', () => {
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type Action = IncludesAction<number[], string, undefined>;
      });

      test('and the requirement is a valid related type', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type Action = IncludesAction<number[], number, undefined>;
      });
    });

    describe('when the input is a tuple', () => {
      test('and the requirement is not a valid related type', () => {
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type Action = IncludesAction<['hello', 1, true], string | number | boolean, undefined>;
      });

      test('and the requirement is a valid related type', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type Action = IncludesAction<['hello', 1, true], 'hello' | 1 | true, undefined>;
      });
    });
  })
});
