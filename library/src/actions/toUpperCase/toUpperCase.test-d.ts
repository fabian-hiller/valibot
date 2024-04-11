import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { toUpperCase, type ToUpperCaseAction } from './toUpperCase.ts';

describe('toUpperCase', () => {
  test('should return action object', () => {
    expectTypeOf(toUpperCase()).toEqualTypeOf<ToUpperCaseAction>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<ToUpperCaseAction>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<ToUpperCaseAction>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<ToUpperCaseAction>>().toEqualTypeOf<never>();
    });
  });
});
