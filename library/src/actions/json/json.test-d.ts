import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  json,
  type JSONAction,
  type JsonIssue,
  type JsonReviver,
} from './json.ts';

const reviver: JsonReviver = (k, v) => v;

describe('json', () => {
  describe('should return action object', () => {
    test('with reviver and message', () => {
      type Action = JSONAction<string, JsonReviver, 'message'>;
      expectTypeOf(json(reviver, 'message')).toEqualTypeOf<Action>();
    });

    test('with reviver and undefined message', () => {
      type Action = JSONAction<string, JsonReviver, undefined>;
      expectTypeOf(json(reviver)).toEqualTypeOf<Action>();
      expectTypeOf(json(reviver, undefined)).toEqualTypeOf<Action>();
    });

    test('with undefined reviver and message', () => {
      type Action = JSONAction<string, undefined, 'message'>;
      expectTypeOf(json(undefined, 'message')).toEqualTypeOf<Action>();
    });

    test('with undefined reviver and undefined message', () => {
      type Action = JSONAction<string, undefined, undefined>;
      expectTypeOf(json()).toEqualTypeOf<Action>();
      expectTypeOf(json(undefined, undefined)).toEqualTypeOf<Action>();
    });
  });

  describe('should infer correct types', () => {
    type Input = 'foo';
    type Action = JSONAction<Input, JsonReviver, 'message'>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toBeUnknown();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<JsonIssue<Input>>();
    });
  });
});
