import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { array, arrayAsync, type ArrayIssue } from '../array/index.ts';
import { number, type NumberIssue } from '../number/index.ts';
import { object, objectAsync, type ObjectIssue } from '../object/index.ts';
import { optional } from '../optional/optional.ts';
import { string, type StringIssue } from '../string/index.ts';
import { intersectAsync, type IntersectSchemaAsync } from './intersectAsync.ts';
import type { IntersectIssue } from './types.ts';

describe('intersectAsync', () => {
  const options = [
    array(object({ key1: string() })),
    arrayAsync(objectAsync({ key2: optional(number(), 123) })),
  ] as const;
  type Options = typeof options;

  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = IntersectSchemaAsync<Options, undefined>;
      expectTypeOf(intersectAsync(options)).toEqualTypeOf<Schema>();
      expectTypeOf(intersectAsync(options, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(intersectAsync(options, 'message')).toEqualTypeOf<
        IntersectSchemaAsync<Options, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(intersectAsync(options, () => 'message')).toEqualTypeOf<
        IntersectSchemaAsync<Options, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = IntersectSchemaAsync<Options, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        { key1: string }[] & { key2?: number | undefined }[]
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        { key1: string }[] & { key2: number }[]
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        IntersectIssue | ArrayIssue | ObjectIssue | StringIssue | NumberIssue
      >();
    });
  });
});
