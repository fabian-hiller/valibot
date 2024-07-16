import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { lazyAsync, type LazySchemaAsync } from './lazyAsync.ts';

describe('lazyAsync', () => {
  test('should return schema object', () => {
    expectTypeOf(lazyAsync(async () => string())).toEqualTypeOf<
      LazySchemaAsync<StringSchema<undefined>>
    >();
  });

  describe('should infer correct types', () => {
    type Schema = LazySchemaAsync<StringSchema<undefined>>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<StringIssue>();
    });
  });
});
