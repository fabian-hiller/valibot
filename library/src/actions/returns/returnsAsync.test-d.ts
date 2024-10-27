import { describe, expectTypeOf, test } from 'vitest';
import { pipeAsync } from '../../methods/index.ts';
import { number } from '../../schemas/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { minValue } from '../minValue/index.ts';
import { type ReturnsActionAsync, returnsAsync } from './returnsAsync.ts';

describe('returnsAsync', () => {
  type Input = (
    arg1: string,
    arg2: number,
    ...rest: boolean[]
  ) => Promise<unknown>;
  const schema = pipeAsync(number(), minValue(0));
  type Schema = typeof schema;
  type Action = ReturnsActionAsync<Input, Schema>;

  test('should return action object', () => {
    expectTypeOf(returnsAsync<Input, Schema>(schema)).toEqualTypeOf<Action>();
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
