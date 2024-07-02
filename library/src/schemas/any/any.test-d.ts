/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { any, type AnySchema } from './any.ts';

describe('any', () => {
  test('should return schema object', () => {
    expectTypeOf(any()).toEqualTypeOf<AnySchema>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<AnySchema>>().toEqualTypeOf<any>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<AnySchema>>().toEqualTypeOf<any>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<AnySchema>>().toEqualTypeOf<never>();
    });
  });
});
