import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { lowerCase, type LowerCaseAction } from './lowerCase.ts';

describe('lowerCase', () => {
  test('should return action object', () => {
    expectTypeOf(lowerCase()).toEqualTypeOf<LowerCaseAction>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<LowerCaseAction>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<LowerCaseAction>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<LowerCaseAction>>().toEqualTypeOf<never>();
    });
  });
});
