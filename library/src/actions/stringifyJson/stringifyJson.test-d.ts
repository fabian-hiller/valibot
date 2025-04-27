import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  type JsonReplacer,
  stringifyJson,
  type StringifyJsonAction,
  type StringifyJsonIssue,
} from './stringifyJson.ts';

describe('stringifyJson', () => {
  describe('should return action object', () => {
    const replacer: JsonReplacer = (key, value) => value;
    type Replacer = typeof replacer;

    test('with undefined replacer and undefined message', () => {
      type Action = StringifyJsonAction<unknown, undefined, undefined>;
      expectTypeOf(stringifyJson()).toEqualTypeOf<Action>();
      expectTypeOf(stringifyJson(undefined)).toEqualTypeOf<Action>();
      expectTypeOf(stringifyJson(undefined, undefined)).toEqualTypeOf<Action>();
    });

    test('with undefined replacer and string message', () => {
      expectTypeOf(stringifyJson(undefined, 'message')).toEqualTypeOf<
        StringifyJsonAction<unknown, undefined, 'message'>
      >();
    });

    test('with undefined replacer and function message', () => {
      expectTypeOf(stringifyJson(undefined, () => 'message')).toEqualTypeOf<
        StringifyJsonAction<unknown, undefined, () => string>
      >();
    });

    test('with replacer and undefined message', () => {
      type Action = StringifyJsonAction<unknown, Replacer, undefined>;
      expectTypeOf(stringifyJson(replacer)).toEqualTypeOf<Action>();
      expectTypeOf(stringifyJson(replacer, undefined)).toEqualTypeOf<Action>();
    });

    test('with replacer and string message', () => {
      expectTypeOf(stringifyJson(replacer, 'message')).toEqualTypeOf<
        StringifyJsonAction<unknown, Replacer, 'message'>
      >();
    });

    test('with replacer and function message', () => {
      expectTypeOf(stringifyJson(replacer, () => 'message')).toEqualTypeOf<
        StringifyJsonAction<unknown, Replacer, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Input = { foo: string };
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
