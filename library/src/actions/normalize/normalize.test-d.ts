import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { normalize, type NormalizeAction } from './normalize.ts';

describe('normalize', () => {
  describe('should return action object', () => {
    test('with undefined form', () => {
      expectTypeOf(normalize()).toEqualTypeOf<NormalizeAction<undefined>>();
    });

    test('with defined form', () => {
      expectTypeOf(normalize('NFKC')).toEqualTypeOf<NormalizeAction<'NFKC'>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = NormalizeAction<undefined>;

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
