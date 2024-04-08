import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { url, type UrlAction, type UrlIssue } from './url.ts';

describe('url', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = UrlAction<string, undefined>;
      expectTypeOf(url()).toEqualTypeOf<Action>();
      expectTypeOf(url(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(url('message')).toEqualTypeOf<
        UrlAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(url(() => 'message')).toEqualTypeOf<
        UrlAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = UrlAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<UrlIssue<string>>();
    });
  });
});
