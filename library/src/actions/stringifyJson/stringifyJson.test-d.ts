import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  type JSONReplacer,
  stringifyJson,
  type StringifyJsonAction,
  type StringifyJsonIssue,
} from './stringifyJson.ts';

const replacer: JSONReplacer = (k, v) => v;

describe('stringifyJson', () => {
  describe('should return action object', () => {
    test('with replacer and message', () => {
      expectTypeOf(stringifyJson(replacer, 'message')).toEqualTypeOf<
        StringifyJsonAction<unknown, typeof replacer, 'message'>
      >();
    });
    test('with replacer and undefined message', () => {
      expectTypeOf(stringifyJson(replacer)).toEqualTypeOf<
        StringifyJsonAction<unknown, typeof replacer, undefined>
      >();
    });
    test('with undefined replacer and message', () => {
      expectTypeOf(stringifyJson(undefined, 'message')).toEqualTypeOf<
        StringifyJsonAction<unknown, undefined, 'message'>
      >();
    });
    test('with undefined replacer and undefined message', () => {
      expectTypeOf(stringifyJson()).toEqualTypeOf<
        StringifyJsonAction<unknown, undefined, undefined>
      >();
    });
  });

  describe('should infer correct types', () => {
    interface Input {
      foo: string;
    }
    type Action = StringifyJsonAction<Input, undefined, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        StringifyJsonIssue<Input>
      >();
    });
  });
});
