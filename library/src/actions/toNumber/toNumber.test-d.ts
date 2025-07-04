import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { toNumber, type ToNumberAction } from './toNumber.ts';

describe('toNumber', () => {
  test('should return action object', () => {
    expectTypeOf(toNumber<'123'>()).toEqualTypeOf<ToNumberAction<'123'>>();
  });

  describe('should infer correct types', () => {
    type Action = ToNumberAction<'123'>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<'123'>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<number>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});
