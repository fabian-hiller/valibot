import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { stringbool, type StringboolAction } from './stringbool.ts';

describe('stringbool', () => {
  test('should return action object', () => {
    expectTypeOf(stringbool<'foo'>()).toEqualTypeOf<StringboolAction<'foo'>>();
  });

  describe('should infer correct types', () => {
    type Action = StringboolAction<'foo'>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<'foo'>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<boolean>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});
