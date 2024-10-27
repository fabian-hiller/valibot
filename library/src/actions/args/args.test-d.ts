import { describe, expectTypeOf, test } from 'vitest';
import { boolean, number, string, tupleWithRest } from '../../schemas/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { args, type ArgsAction } from './args.ts';

describe('args', () => {
  type Input = (...args: unknown[]) => number;
  const schema = tupleWithRest([string(), number()], boolean());
  type Schema = typeof schema;
  type Action = ArgsAction<Input, Schema>;

  test('should return action object', () => {
    expectTypeOf(args<Input, Schema>(schema)).toEqualTypeOf<Action>();
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
