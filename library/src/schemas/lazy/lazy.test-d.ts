import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { lazy, type LazySchema } from './lazy.ts';

describe('lazy', () => {
  test('should return schema object', () => {
    expectTypeOf(lazy(() => string())).toEqualTypeOf<
      LazySchema<StringSchema<undefined>>
    >();
  });

  describe('should infer correct types', () => {
    type Schema = LazySchema<StringSchema<undefined>>;

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
