import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { examples, type ExamplesAction } from './examples.ts';

describe('examples', () => {
  test('should return action object', () => {
    type Action = ExamplesAction<string, ['foo', 'bar']>;
    expectTypeOf(
      examples<string, ['foo', 'bar']>(['foo', 'bar'])
    ).toEqualTypeOf<Action>();
  });

  describe('should infer correct types', () => {
    type Input = 'foo' | 'bar';
    type Action = ExamplesAction<Input, ['foo', 'bar']>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});
