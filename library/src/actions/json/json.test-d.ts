import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { json, type JsonAction, type JsonIssue } from './json.ts';

describe('json', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = JsonAction<string, undefined>;
      expectTypeOf(json<string>()).toEqualTypeOf<Action>();
      expectTypeOf(json<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(json<string, 'message'>('message')).toEqualTypeOf<
        JsonAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(json<string, () => string>(() => 'message')).toEqualTypeOf<
        JsonAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = JsonAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<JsonIssue<string>>();
    });
  });
});
