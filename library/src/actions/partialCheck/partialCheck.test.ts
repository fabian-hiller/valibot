import { describe, expect, test } from 'vitest';
import type {
  NumberIssue,
  ObjectIssue,
  StringIssue,
} from '../../schemas/index.ts';
import type {
  DeepPickN,
  TypedDataset,
  UntypedDataset,
} from '../../types/index.ts';
import type { MinLengthIssue } from '../minLength/index.ts';
import { partialCheck, type PartialCheckAction } from './partialCheck.ts';
import type { PartialCheckIssue } from './types.ts';

describe('partialCheck', () => {
  describe('should return action object', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Input = { nested: { key: string } };
    const pathList = [['nested', 'key']] as const;
    type PathList = typeof pathList;
    const requirement = (input: DeepPickN<Input, PathList>) =>
      input.nested.key.includes('foo');
    const baseAction: Omit<
      PartialCheckAction<Input, PathList, never>,
      'message'
    > = {
      kind: 'validation',
      type: 'partial_check',
      reference: partialCheck,
      expects: null,
      requirement,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: PartialCheckAction<Input, PathList, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(
        partialCheck<Input, PathList>(pathList, requirement)
      ).toStrictEqual(action);
      expect(
        partialCheck<Input, PathList, undefined>(
          pathList,
          requirement,
          undefined
        )
      ).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(
        partialCheck<Input, PathList, 'message'>(pathList, requirement, message)
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies PartialCheckAction<Input, PathList, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(
        partialCheck<Input, PathList, typeof message>(
          pathList,
          requirement,
          message
        )
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies PartialCheckAction<Input, PathList, typeof message>);
    });
  });

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Input = {
    nested: { key: string };
    tuple: [number, { key: string }, number];
    other: string;
  };
  const pathList = [
    ['nested', 'key'],
    ['tuple', 1, 'key'],
  ] as const;
  type PathList = typeof pathList;
  const requirement = (input: DeepPickN<Input, PathList>) =>
    input.nested.key === input.tuple[1].key;
  const action = partialCheck<Input, PathList, 'message'>(
    [
      ['nested', 'key'],
      ['tuple', 1, 'key'],
    ],
    requirement,
    'message'
  );

  const baseInfo = {
    message: 'message',
    requirement: undefined,
    path: undefined,
    issues: undefined,
    lang: undefined,
    abortEarly: undefined,
    abortPipeEarly: undefined,
  };

  describe('should return same dataset', () => {
    test('if root is untyped', () => {
      const dataset: UntypedDataset<ObjectIssue> = {
        typed: false,
        value: null,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'object',
            input: null,
            expected: 'Object',
            received: 'null',
            path: undefined,
          },
        ],
      };
      expect(action._run(dataset, {})).toStrictEqual(dataset);
    });

    test('if part of path is untyped', () => {
      const input = {
        nested: null,
        tuple: [123, { key: 'foo' }, 456],
        other: 'bar',
      };
      const dataset: UntypedDataset<ObjectIssue> = {
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'object',
            input: null,
            expected: 'Object',
            received: 'null',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'nested',
                value: input.nested,
              },
            ],
          },
        ],
      };
      expect(action._run(dataset, {})).toStrictEqual(dataset);
    });

    test('if entire path is untyped', () => {
      const input = {
        nested: { key: null },
        tuple: [123, { key: 'foo' }, 456],
        other: 'bar',
      };
      const dataset: UntypedDataset<StringIssue> = {
        typed: false,
        value: input,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'string',
            input: null,
            expected: 'string',
            received: 'null',
            path: [
              {
                type: 'object',
                origin: 'value',
                input,
                key: 'nested',
                value: input.nested,
              },
              {
                type: 'object',
                origin: 'value',
                input: input.nested,
                key: 'key',
                value: input.nested.key,
              },
            ],
          },
        ],
      };
      expect(action._run(dataset, {})).toStrictEqual(dataset);
    });

    test('if validation returns true', () => {
      const dataset: TypedDataset<Input, never> = {
        typed: true,
        value: {
          nested: { key: 'foo' },
          tuple: [123, { key: 'foo' }, 456],
          other: 'bar',
        },
        issues: undefined,
      };
      expect(action._run(dataset, {})).toStrictEqual(dataset);
    });
  });

  describe('should add issue to dataset', () => {
    test('if there are no issues', () => {
      const input: Input = {
        nested: { key: 'foo' },
        tuple: [123, { key: 'baz' }, 456],
        other: 'bar',
      };
      const dataset: TypedDataset<Input, never> = {
        typed: true,
        value: input,
        issues: undefined,
      };
      expect(action._run(dataset, {})).toStrictEqual({
        ...dataset,
        issues: [
          {
            ...baseInfo,
            kind: 'validation',
            type: 'partial_check',
            input,
            expected: null,
            received: 'Object',
            requirement,
          },
        ],
      } satisfies TypedDataset<
        Input,
        PartialCheckIssue<DeepPickN<Input, PathList>>
      >);
    });

    test('if there are no schema issues', () => {
      const input: Input = {
        nested: { key: 'foo' },
        tuple: [123, { key: 'baz' }, 456],
        other: 'bar',
      };
      const firstIssue: MinLengthIssue<string, 5> = {
        ...baseInfo,
        kind: 'validation',
        type: 'min_length',
        input: 'foo',
        expected: '>=5',
        received: '3',
        requirement: 5,
        path: [
          {
            type: 'object',
            origin: 'value',
            input,
            key: 'nested',
            value: input.nested,
          },
          {
            type: 'object',
            origin: 'value',
            input: input.nested,
            key: 'key',
            value: input.nested.key,
          },
        ],
      };
      const dataset: TypedDataset<Input, MinLengthIssue<string, 5>> = {
        typed: true,
        value: input,
        issues: [firstIssue],
      };
      expect(action._run(dataset, {})).toStrictEqual({
        ...dataset,
        issues: [
          firstIssue,
          {
            ...baseInfo,
            kind: 'validation',
            type: 'partial_check',
            input,
            expected: null,
            received: 'Object',
            requirement,
          },
        ],
      } satisfies TypedDataset<
        Input,
        | MinLengthIssue<string, 5>
        | PartialCheckIssue<DeepPickN<Input, PathList>>
      >);
    });

    test('if only unselected paths are untyped', () => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
      type Input = {
        nested: { key: string };
        tuple: [number, { key: string }, null];
        other: null;
      };
      const input: Input = {
        nested: { key: 'foo' },
        tuple: [123, { key: 'baz' }, null],
        other: null,
      };
      const firstIssue: NumberIssue = {
        ...baseInfo,
        kind: 'schema',
        type: 'number',
        input: null,
        expected: 'number',
        received: 'null',
        path: [
          {
            type: 'object',
            origin: 'value',
            input,
            key: 'tuple',
            value: input.tuple,
          },
          {
            type: 'array',
            origin: 'value',
            input: input.tuple,
            key: 2,
            value: input.tuple[2],
          },
        ],
      };
      const secondIssue: StringIssue = {
        ...baseInfo,
        kind: 'schema',
        type: 'string',
        input: null,
        expected: 'string',
        received: 'null',
        path: [
          {
            type: 'object',
            origin: 'value',
            input,
            key: 'other',
            value: input.other,
          },
        ],
      };
      const dataset: UntypedDataset<NumberIssue | StringIssue> = {
        typed: false,
        value: input,
        issues: [firstIssue, secondIssue],
      };
      expect(action._run(dataset, {})).toStrictEqual({
        ...dataset,
        issues: [
          firstIssue,
          secondIssue,
          {
            ...baseInfo,
            kind: 'validation',
            type: 'partial_check',
            input: input as DeepPickN<Input, PathList>,
            expected: null,
            received: 'Object',
            requirement,
          },
        ],
      } satisfies UntypedDataset<
        | NumberIssue
        | StringIssue
        | PartialCheckIssue<DeepPickN<Input, PathList>>
      >);
    });
  });
});
