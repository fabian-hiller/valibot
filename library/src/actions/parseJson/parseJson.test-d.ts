import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  type JsonReviver,
  parseJson,
  type ParseJsonAction,
  type ParseJsonIssue,
} from './parseJson.ts';

describe('parseJson', () => {
  describe('should return action object', () => {
    const reviver: JsonReviver = (key, value) => value;

    test('with undefined reviver and undefined message', () => {
      type Action = ParseJsonAction<string, undefined, undefined>;
      expectTypeOf(parseJson()).toEqualTypeOf<Action>();
      expectTypeOf(parseJson(undefined)).toEqualTypeOf<Action>();
      expectTypeOf(parseJson(undefined, undefined)).toEqualTypeOf<Action>();
    });

    test('with undefined reviver and string message', () => {
      expectTypeOf(parseJson(undefined, 'message')).toEqualTypeOf<
        ParseJsonAction<string, undefined, 'message'>
      >();
    });

    test('with undefined reviver and function message', () => {
      expectTypeOf(parseJson(undefined, () => 'message')).toEqualTypeOf<
        ParseJsonAction<string, undefined, () => string>
      >();
    });

    test('with reviver and undefined message', () => {
      type Action = ParseJsonAction<string, JsonReviver, undefined>;
      expectTypeOf(parseJson(reviver)).toEqualTypeOf<Action>();
      expectTypeOf(parseJson(reviver, undefined)).toEqualTypeOf<Action>();
    });

    test('with reviver and string message', () => {
      expectTypeOf(parseJson(reviver, 'message')).toEqualTypeOf<
        ParseJsonAction<string, JsonReviver, 'message'>
      >();
    });

    test('with reviver and function message', () => {
      expectTypeOf(parseJson(reviver, () => 'message')).toEqualTypeOf<
        ParseJsonAction<string, JsonReviver, () => string>
      >();
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
