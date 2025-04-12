import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  type JsonReviver,
  parseJson,
  type ParseJsonAction,
  type ParseJsonIssue,
} from './parseJson.ts';

const reviver: JsonReviver = (k, v) => v;

describe('parseJson', () => {
  describe('should return action object', () => {
    test('with reviver and message', () => {
      type Action = ParseJsonAction<string, JsonReviver, 'message'>;
      expectTypeOf(parseJson(reviver, 'message')).toEqualTypeOf<Action>();
    });

    test('with reviver and undefined message', () => {
      type Action = ParseJsonAction<string, JsonReviver, undefined>;
      expectTypeOf(parseJson(reviver)).toEqualTypeOf<Action>();
    });

    test('with undefined reviver and message', () => {
      type Action = ParseJsonAction<string, undefined, 'message'>;
      expectTypeOf(parseJson(undefined, 'message')).toEqualTypeOf<Action>();
    });

    test('with undefined reviver and undefined message', () => {
      type Action = ParseJsonAction<string, undefined, undefined>;
      expectTypeOf(parseJson()).toEqualTypeOf<Action>();
    });
  });

  describe('should infer correct types', () => {
    type Input = 'foo';
    type Action = ParseJsonAction<Input, JsonReviver, 'message'>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toBeUnknown();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ParseJsonIssue<Input>>();
    });
  });
});
