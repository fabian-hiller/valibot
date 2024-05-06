import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { literal, type LiteralIssue } from '../literal/index.ts';
import { number, type NumberIssue } from '../number/index.ts';
import { union, type UnionIssue, type UnionSchema } from './union.ts';

describe('union', () => {
  const options = [literal('foo'), literal('bar'), number()] as const;
  type Options = typeof options;

  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = UnionSchema<Options, undefined>;
      expectTypeOf(union(options)).toEqualTypeOf<Schema>();
      expectTypeOf(union(options, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(union(options, 'message')).toEqualTypeOf<
        UnionSchema<Options, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(union(options, () => 'message')).toEqualTypeOf<
        UnionSchema<Options, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = UnionSchema<Options, undefined>;

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
