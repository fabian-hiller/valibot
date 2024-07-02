import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { unknown, type UnknownSchema } from './unknown.ts';

describe('unknown', () => {
  test('should return schema object', () => {
    expectTypeOf(unknown()).toEqualTypeOf<UnknownSchema>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<UnknownSchema>>().toEqualTypeOf<unknown>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<UnknownSchema>>().toEqualTypeOf<unknown>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<UnknownSchema>>().toEqualTypeOf<never>();
    });
  });
});
