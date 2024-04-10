import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { upperCase, type UpperCaseAction } from './upperCase.ts';

describe('upperCase', () => {
  test('should return action object', () => {
    expectTypeOf(upperCase()).toEqualTypeOf<UpperCaseAction>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<UpperCaseAction>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<UpperCaseAction>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<UpperCaseAction>>().toEqualTypeOf<never>();
    });
  });
});
