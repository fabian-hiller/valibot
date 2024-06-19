import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  type RawTransformActionAsync,
  rawTransformAsync,
} from './rawTransformAsync.ts';
import type { RawTransformIssue } from './types.ts';

describe('rawTransformAsync', () => {
  test('should return action object', () => {
    expectTypeOf(
      rawTransformAsync<string, number>(
        async ({ dataset }) => dataset.value.length
      )
    ).toEqualTypeOf<RawTransformActionAsync<string, number>>();
  });

  describe('should infer correct types', () => {
    type Action = RawTransformActionAsync<string, number>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<number>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        RawTransformIssue<string>
      >();
    });
  });
});
