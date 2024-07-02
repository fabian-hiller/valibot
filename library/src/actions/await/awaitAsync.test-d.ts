import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { type AwaitActionAsync, awaitAsync } from './awaitAsync.ts';

describe('awaitAsync', () => {
  type Input = Promise<string>;
  type Action = AwaitActionAsync<Promise<string>>;

  test('should return action object', () => {
    expectTypeOf(awaitAsync<Input>()).toEqualTypeOf<Action>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});
