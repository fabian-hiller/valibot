import { describe, expectTypeOf, test } from 'vitest';
import {
  boolean,
  number,
  string,
  tupleWithRestAsync,
} from '../../schemas/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { type ArgsActionAsync, argsAsync } from './argsAsync.ts';

describe('argsAsync', () => {
  type Input = (...args: unknown[]) => Promise<number>;
  const schema = tupleWithRestAsync([string(), number()], boolean());
  type Schema = typeof schema;
  type Action = ArgsActionAsync<Input, Schema>;

  test('should return action object', () => {
    expectTypeOf(argsAsync<Input, Schema>(schema)).toEqualTypeOf<Action>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<
        (arg1: string, arg2: number, ...rest: boolean[]) => Promise<number>
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});
