import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { metadata, type MetadataAction } from './metadata.ts';

describe('metadata', () => {
  type Action = MetadataAction<string, { key: 'foo' }>;

  test('should return action object', () => {
    expectTypeOf(
      metadata<string, { key: 'foo' }>({ key: 'foo' })
    ).toEqualTypeOf<Action>();
  });

  describe('should infer correct types', () => {
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
