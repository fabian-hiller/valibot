import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { type RawCheckActionAsync, rawCheckAsync } from './rawCheckAsync.ts';
import type { RawCheckIssue } from './types.ts';

describe('rawCheckAsync', () => {
  test('should return action object', () => {
    expectTypeOf(rawCheckAsync<string>(async () => {})).toEqualTypeOf<
      RawCheckActionAsync<string>
    >();
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = RawCheckActionAsync<Input>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<RawCheckIssue<Input>>();
    });
  });
});
