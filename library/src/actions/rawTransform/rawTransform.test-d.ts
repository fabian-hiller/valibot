import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { rawTransform, type RawTransformAction } from './rawTransform.ts';
import type { RawTransformIssue } from './types.ts';

describe('rawTransform', () => {
  test('should return action object', () => {
    expectTypeOf(
      rawTransform<string, number>(({ dataset }) => dataset.value.length)
    ).toEqualTypeOf<RawTransformAction<string, number>>();
  });

  describe('should infer correct types', () => {
    type Action = RawTransformAction<string, number>;

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
