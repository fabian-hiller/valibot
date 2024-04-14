import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { symbol, type SymbolIssue, type SymbolSchema } from './symbol.ts';

describe('symbol', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = SymbolSchema<undefined>;
      expectTypeOf(symbol()).toEqualTypeOf<Schema>();
      expectTypeOf(symbol(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(symbol('message')).toEqualTypeOf<SymbolSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(symbol(() => 'message')).toEqualTypeOf<
        SymbolSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = SymbolSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<symbol>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<symbol>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<SymbolIssue>();
    });
  });
});
