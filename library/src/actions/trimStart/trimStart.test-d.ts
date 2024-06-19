import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { trimStart, type TrimStartAction } from './trimStart.ts';

describe('trim', () => {
  test('should return action object', () => {
    expectTypeOf(trimStart()).toEqualTypeOf<TrimStartAction>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<TrimStartAction>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<TrimStartAction>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<TrimStartAction>>().toEqualTypeOf<never>();
    });
  });
});
