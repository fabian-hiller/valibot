import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { rawCheck, type RawCheckAction } from './rawCheck.ts';
import type { RawCheckIssue } from './types.ts';

describe('rawCheck', () => {
  test('should return action object', () => {
    expectTypeOf(rawCheck<string>(() => {})).toEqualTypeOf<
      RawCheckAction<string>
    >();
  });

  describe('should infer correct types', () => {
    type Input = ['foo', 123, true];
    type Action = RawCheckAction<Input>;

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
