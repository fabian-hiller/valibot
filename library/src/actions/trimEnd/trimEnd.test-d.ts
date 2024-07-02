import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { trimEnd, type TrimEndAction } from './trimEnd.ts';

describe('trim', () => {
  test('should return action object', () => {
    expectTypeOf(trimEnd()).toEqualTypeOf<TrimEndAction>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<TrimEndAction>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<TrimEndAction>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<TrimEndAction>>().toEqualTypeOf<never>();
    });
  });
});
