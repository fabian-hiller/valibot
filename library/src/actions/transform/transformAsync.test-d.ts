import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { type TransformActionAsync, transformAsync } from './transformAsync.ts';

describe('transformAsync', () => {
  type Action = TransformActionAsync<string, number>;

  test('should return action object', () => {
    expectTypeOf(
      transformAsync(async (value: string) => value.length)
    ).toEqualTypeOf<Action>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<number>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});
