import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { trim, type TrimAction } from './trim.ts';

describe('trim', () => {
  test('should return action object', () => {
    expectTypeOf(trim()).toEqualTypeOf<TrimAction>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<TrimAction>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<TrimAction>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<TrimAction>>().toEqualTypeOf<never>();
    });
  });
});
