import { describe, expectTypeOf, test } from 'vitest';
import { number } from '../../schemas/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { returns, type ReturnsAction } from './returns.ts';

describe('returns', () => {
  type Input = (arg1: string, arg2: number, ...rest: boolean[]) => unknown;
  const schema = number();
  type Schema = typeof schema;
  type Action = ReturnsAction<Input, Schema>;

  test('should return action object', () => {
    expectTypeOf(returns<Input, Schema>(schema)).toEqualTypeOf<Action>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<
        (arg1: string, arg2: number, ...rest: boolean[]) => number
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});
