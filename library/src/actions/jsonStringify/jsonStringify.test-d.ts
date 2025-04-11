import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  type JSONReplacer,
  jsonStringify,
  type JsonStringifyAction,
  type JsonStringifyIssue,
} from './jsonStringify.ts';

const replacer: JSONReplacer = (k, v) => v;

describe('jsonStringify', () => {
  describe('should return action object', () => {
    test('with replacer and message', () => {
      expectTypeOf(jsonStringify(replacer, 'message')).toEqualTypeOf<
        JsonStringifyAction<unknown, typeof replacer, 'message'>
      >();
    });
    test('with replacer and undefined message', () => {
      expectTypeOf(jsonStringify(replacer)).toEqualTypeOf<
        JsonStringifyAction<unknown, typeof replacer, undefined>
      >();
    });
    test('with undefined replacer and message', () => {
      expectTypeOf(jsonStringify(undefined, 'message')).toEqualTypeOf<
        JsonStringifyAction<unknown, undefined, 'message'>
      >();
    });
    test('with undefined replacer and undefined message', () => {
      expectTypeOf(jsonStringify()).toEqualTypeOf<
        JsonStringifyAction<unknown, undefined, undefined>
      >();
    });
  });

  describe('should infer correct types', () => {
    interface Input {
      foo: string;
    }
    type Action = JsonStringifyAction<Input, undefined, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        JsonStringifyIssue<Input>
      >();
    });
  });
});
