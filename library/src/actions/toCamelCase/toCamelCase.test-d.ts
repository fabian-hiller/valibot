import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/infer.ts';
import { toCamelCase, type ToCamelCaseAction } from './toCamelCase.ts';

describe('toCamelCase', () => {
  test('should return action object', () => {
    expectTypeOf(toCamelCase()).toEqualTypeOf<ToCamelCaseAction>();
  });

  describe('should infer correct types', () => {
    type Action = ToCamelCaseAction;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});
