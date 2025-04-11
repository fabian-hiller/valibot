import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  jsonParse,
  type JsonParseAction,
  type JsonParseIssue,
  type JsonReviver,
} from './jsonParse.ts';

const reviver: JsonReviver = (k, v) => v;

describe('jsonParse', () => {
  describe('should return action object', () => {
    test('with reviver and message', () => {
      type Action = JsonParseAction<string, JsonReviver, 'message'>;
      expectTypeOf(jsonParse(reviver, 'message')).toEqualTypeOf<Action>();
    });

    test('with reviver and undefined message', () => {
      type Action = JsonParseAction<string, JsonReviver, undefined>;
      expectTypeOf(jsonParse(reviver)).toEqualTypeOf<Action>();
    });

    test('with undefined reviver and message', () => {
      type Action = JsonParseAction<string, undefined, 'message'>;
      expectTypeOf(jsonParse(undefined, 'message')).toEqualTypeOf<Action>();
    });

    test('with undefined reviver and undefined message', () => {
      type Action = JsonParseAction<string, undefined, undefined>;
      expectTypeOf(jsonParse()).toEqualTypeOf<Action>();
    });
  });

  describe('should infer correct types', () => {
    type Input = 'foo';
    type Action = JsonParseAction<Input, JsonReviver, 'message'>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toBeUnknown();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<JsonParseIssue<Input>>();
    });
  });
});
