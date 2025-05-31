import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { toBigint, type ToBigintAction } from './toBigint.ts';

describe('toBigint', () => {
  test('should return action object', () => {
    expectTypeOf(toBigint<'123'>()).toEqualTypeOf<ToBigintAction<'123'>>();
  });

  describe('should infer correct types', () => {
    type Action = ToBigintAction<'123'>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<'123'>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<bigint>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});
