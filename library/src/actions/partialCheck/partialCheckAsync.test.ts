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
import {
  type PartialCheckActionAsync,
  partialCheckAsync,
} from './partialCheckAsync.ts';
import type { PartialCheckIssue } from './types.ts';

describe('partialCheckAsync', () => {
  describe('should return action object', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Input = { nested: { key: string } };
    const pathList = [['nested', 'key']] as const;
    type PathList = typeof pathList;
    type Selection = DeepPickN<Input, PathList>;
    const requirement = async (input: Selection) =>
      input.nested.key.includes('foo');
    const baseAction: Omit<
      PartialCheckActionAsync<Input, Selection, never>,
      'message'
    > = {
      kind: 'validation',
      type: 'partial_check',
      reference: partialCheckAsync,
      expects: null,
      requirement,
      async: true,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: PartialCheckActionAsync<Input, Selection, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(
        partialCheckAsync<Input, PathList, Selection>(pathList, requirement)
      ).toStrictEqual(action);
      expect(
        partialCheckAsync<Input, PathList, Selection, undefined>(
          pathList,
          requirement,
          undefined
        )
      ).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(
        partialCheckAsync<Input, PathList, Selection, 'message'>(
          pathList,
          requirement,
          message
        )
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies PartialCheckActionAsync<Input, Selection, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(
        partialCheckAsync<Input, PathList, Selection, typeof message>(
          pathList,
          requirement,
          message
        )
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies PartialCheckActionAsync<Input, Selection, typeof message>);
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
  const requirement = async (input: Selection) =>
    input.nested.key === input.tuple[1].key;
  const action = partialCheckAsync<Input, PathList, Selection, 'message'>(
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
    test('if root is untyped', async () => {
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
      expect(await action._run(dataset, {})).toStrictEqual(dataset);
    });

    test('if part of path is untyped', async () => {
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
      expect(await action._run(dataset, {})).toStrictEqual(dataset);
    });

    test('if entire path is untyped', async () => {
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
      expect(await action._run(dataset, {})).toStrictEqual(dataset);
    });

    test('if validation returns true', async () => {
      const dataset: TypedDataset<Input, never> = {
        typed: true,
        value: {
          nested: { key: 'foo' },
          tuple: [123, { key: 'foo' }, 456],
          other: 'bar',
        },
        issues: undefined,
      };
      expect(await action._run(dataset, {})).toStrictEqual(dataset);
    });
  });

  describe('should add issue to dataset', () => {
    test('if there are no issues', async () => {
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
      expect(await action._run(dataset, {})).toStrictEqual({
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
      } satisfies TypedDataset<Input, PartialCheckIssue<Selection>>);
    });

    test('if there are no schema issues', async () => {
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
      expect(await action._run(dataset, {})).toStrictEqual({
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
        MinLengthIssue<string, 5> | PartialCheckIssue<Selection>
      >);
    });

    test('if only unselected paths are untyped', async () => {
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
      const dataset: UntypedDataset<NumberIssue | StringIssue> = {
        typed: false,
        value: input,
        issues: [firstIssue, secondIssue],
      };
      expect(await action._run(dataset, {})).toStrictEqual({
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
      } satisfies UntypedDataset<
        NumberIssue | StringIssue | PartialCheckIssue<Selection>
      >);
    });
  });
});
