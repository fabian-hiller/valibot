import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { literal, type LiteralIssue } from '../literal/index.ts';
import { number, type NumberIssue } from '../number/index.ts';
import type { UnionIssue } from './types.ts';
import { unionAsync, type UnionSchemaAsync } from './unionAsync.ts';

describe('unionAsync', () => {
  const options = [literal('foo'), literal('bar'), number()] as const;
  type Options = typeof options;

  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = UnionSchemaAsync<Options, undefined>;
      expectTypeOf(unionAsync(options)).toEqualTypeOf<Schema>();
      expectTypeOf(unionAsync(options, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(unionAsync(options, 'message')).toEqualTypeOf<
        UnionSchemaAsync<Options, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(unionAsync(options, () => 'message')).toEqualTypeOf<
        UnionSchemaAsync<Options, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = UnionSchemaAsync<Options, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        'foo' | 'bar' | number
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        'foo' | 'bar' | number
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        UnionIssue<LiteralIssue | NumberIssue> | LiteralIssue | NumberIssue
      >();
    });
  });
});
