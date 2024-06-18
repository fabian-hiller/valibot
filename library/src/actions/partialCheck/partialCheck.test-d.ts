import { describe, expectTypeOf, test } from 'vitest';
import type {
  DeepPickN,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { partialCheck, type PartialCheckAction } from './partialCheck.ts';
import type { PartialCheckIssue } from './types.ts';

describe('partialCheck', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Input = { nested: { key: string } };
  const pathList = [['nested', 'key']] as const;
  type PathList = typeof pathList;
  const requirement = (input: DeepPickN<Input, PathList>) =>
    input.nested.key.includes('foo');

  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = PartialCheckAction<Input, PathList, undefined>;
      expectTypeOf(
        partialCheck<Input, PathList>(pathList, requirement)
      ).toEqualTypeOf<Action>();
      expectTypeOf(
        partialCheck<Input, PathList, undefined>(
          pathList,
          requirement,
          undefined
        )
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        partialCheck<Input, PathList, 'message'>(
          pathList,
          requirement,
          'message'
        )
      ).toEqualTypeOf<PartialCheckAction<Input, PathList, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        partialCheck<Input, PathList, () => string>(
          pathList,
          requirement,
          () => 'message'
        )
      ).toEqualTypeOf<PartialCheckAction<Input, PathList, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = PartialCheckAction<Input, PathList, undefined>;

    test('of input', () => {
      // @ts-ignore
      expectTyperOf<InferInput<Action>>().toEqualTypeOf<Input>();
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
