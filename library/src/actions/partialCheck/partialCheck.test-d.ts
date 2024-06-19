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
  type Selection = DeepPickN<Input, PathList>;
  const requirement = (input: Selection) => input.nested.key.includes('foo');

  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = PartialCheckAction<Input, Selection, undefined>;
      expectTypeOf(
        partialCheck<Input, PathList, Selection>(pathList, requirement)
      ).toEqualTypeOf<Action>();
      expectTypeOf(
        partialCheck<Input, PathList, Selection, undefined>(
          pathList,
          requirement,
          undefined
        )
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        partialCheck<Input, PathList, Selection, 'message'>(
          pathList,
          requirement,
          'message'
        )
      ).toEqualTypeOf<PartialCheckAction<Input, Selection, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        partialCheck<Input, PathList, Selection, () => string>(
          pathList,
          requirement,
          () => 'message'
        )
      ).toEqualTypeOf<PartialCheckAction<Input, Selection, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = PartialCheckAction<Input, Selection, undefined>;

    test('of input', () => {
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
