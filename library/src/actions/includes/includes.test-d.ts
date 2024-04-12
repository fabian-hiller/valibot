import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { ContentRequirement } from '../types.ts';
import {
  includes,
  type IncludesAction,
  type IncludesIssue,
} from './includes.ts';

describe('includes', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IncludesAction<string, 'foo', undefined>;
      expectTypeOf(includes<string, 'foo'>('foo')).toEqualTypeOf<Action>();
      expectTypeOf(
        includes<string, 'foo', undefined>('foo', undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        includes<string, 'foo', 'message'>('foo', 'message')
      ).toEqualTypeOf<IncludesAction<string, 'foo', 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        includes<string, 'foo', () => string>('foo', () => 'message')
      ).toEqualTypeOf<IncludesAction<string, 'foo', () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = IncludesAction<Input, 123, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        IncludesIssue<Input, 123>
      >();
    });

    test('of requirement', () => {
      expectTypeOf<Action['requirement']>().toMatchTypeOf<
        ContentRequirement<Input>
      >();
    });
  });
});
