import { describe, expectTypeOf, test } from 'vitest';
import type {
  DeepPickN,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import {
  type PartialCheckActionAsync,
  partialCheckAsync,
} from './partialCheckAsync.ts';
import type { PartialCheckIssue } from './types.ts';

describe('partialCheckAsync', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Input = { nested: { key: string } };
  const pathList = [['nested', 'key']] as const;
  type PathList = typeof pathList;
  const requirement = (input: DeepPickN<Input, PathList>) =>
    input.nested.key.includes('foo');

  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = PartialCheckActionAsync<Input, PathList, undefined>;
      expectTypeOf(
        partialCheckAsync<Input, PathList>(pathList, requirement)
      ).toEqualTypeOf<Action>();
      expectTypeOf(
        partialCheckAsync<Input, PathList, undefined>(
          pathList,
          requirement,
          undefined
        )
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        partialCheckAsync<Input, PathList, 'message'>(
          pathList,
          requirement,
          'message'
        )
      ).toEqualTypeOf<PartialCheckActionAsync<Input, PathList, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        partialCheckAsync<Input, PathList, () => string>(
          pathList,
          requirement,
          () => 'message'
        )
      ).toEqualTypeOf<PartialCheckActionAsync<Input, PathList, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = PartialCheckActionAsync<Input, PathList, undefined>;

    test('of input', () => {
      // @ts-ignore
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        PartialCheckIssue<Input>
      >();
    });
  });
});
