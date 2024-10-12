import { describe, expect, test } from 'vitest';
import type {
  NumberIssue,
  ObjectIssue,
  StringIssue,
} from '../../schemas/index.ts';
import type {
  DeepPickN,
  FailureDataset,
  PartialDataset,
  SuccessDataset,
} from '../../types/index.ts';
import { partialCheck, type PartialCheckAction } from './partialCheck.ts';
import type { PartialCheckIssue } from './types.ts';

describe('partialCheck', () => {
  describe('should return action object', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Input = { nested: { key: string } };
    const pathList = [['nested', 'key']] as const;
    type PathList = typeof pathList;
    type Selection = DeepPickN<Input, PathList>;
    const requirement = (input: Selection) => input.nested.key.includes('foo');
    const baseAction: Omit<
      PartialCheckAction<Input, Selection, never>,
      'message'
    > = {
      kind: 'validation',
      type: 'partial_check',
      reference: partialCheck,
      expects: null,
      requirement,
      async: false,
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: PartialCheckAction<Input, Selection, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(
        partialCheck<Input, PathList, Selection>(pathList, requirement)
      ).toStrictEqual(action);
      expect(
        partialCheck<Input, PathList, Selection, undefined>(
          pathList,
          requirement,
          undefined
        )
      ).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(
        partialCheck<Input, PathList, Selection, 'message'>(
          pathList,
          requirement,
          message
        )
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies PartialCheckAction<Input, Selection, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(
        partialCheck<Input, PathList, Selection, typeof message>(
          pathList,
          requirement,
          message
        )
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies PartialCheckAction<Input, Selection, typeof message>);
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
  type Selection = DeepPickN<Input, PathList>;
  const requirement = (input: Selection) =>
    input.nested.key === input.tuple[1].key;
  const action = partialCheck<Input, PathList, Selection, 'message'>(
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
      const dataset: FailureDataset<ObjectIssue> = {
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
      expect(action['~validate'](dataset, {})).toStrictEqual(dataset);
    });

    test('if part of path is untyped', () => {
      const input = {
        nested: null,
        tuple: [123, { key: 'foo' }, 456],
        other: 'bar',
      };
      const dataset: FailureDataset<ObjectIssue> = {
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
      expect(action['~validate'](dataset, {})).toStrictEqual(dataset);
    });

    test('if entire path is untyped', () => {
      const input = {
        nested: { key: null },
        tuple: [123, { key: 'foo' }, 456],
        other: 'bar',
      };
      const dataset: FailureDataset<StringIssue> = {
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
      expect(action['~validate'](dataset, {})).toStrictEqual(dataset);
    });

    test('if validation returns true', () => {
      const dataset: SuccessDataset<Input> = {
        typed: true,
        value: {
          nested: { key: 'foo' },
          tuple: [123, { key: 'foo' }, 456],
          other: 'bar',
        },
      };
      expect(action['~validate'](dataset, {})).toStrictEqual(dataset);
    });
  });

  describe('should add issue to dataset', () => {
    test('if there are no issues', () => {
      const input: Input = {
        nested: { key: 'foo' },
        tuple: [123, { key: 'baz' }, 456],
        other: 'bar',
      };
      const dataset: SuccessDataset<Input> = {
        typed: true,
        value: input,
      };
      expect(action['~validate'](dataset, {})).toStrictEqual({
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
      } satisfies PartialDataset<Input, PartialCheckIssue<Selection>>);
    });

    test('if only unselected paths are untyped', () => {
      const input: {
        nested: { key: string };
        tuple: [number, { key: string }, null];
        other: null;
      } = {
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
      const dataset: FailureDataset<NumberIssue | StringIssue> = {
        typed: false,
        value: input,
        issues: [firstIssue, secondIssue],
      };
      expect(action['~validate'](dataset, {})).toStrictEqual({
        ...dataset,
        issues: [
          firstIssue,
          secondIssue,
          {
            ...baseInfo,
            kind: 'validation',
            type: 'partial_check',
            input: input,
            expected: null,
            received: 'Object',
            requirement,
          },
        ],
      } satisfies FailureDataset<
        NumberIssue | StringIssue | PartialCheckIssue<Selection>
      >);
    });
  });
});
