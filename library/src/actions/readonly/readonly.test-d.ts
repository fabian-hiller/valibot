import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { readonly, type ReadonlyAction } from './readonly.ts';

describe('readonly', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Input = { key: string };
  type Action = ReadonlyAction<Input>;

  test('should return action object', () => {
    expectTypeOf(readonly<Input>()).toEqualTypeOf<Action>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Readonly<Input>>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});
