import { describe, expect, test } from 'vitest';
import { minValue, type MinValueIssue } from '../../actions/index.ts';
import { pipe } from '../../methods/index.ts';
import { number, objectWithRest, string } from '../../schemas/index.ts';
import type {
  Dataset,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import { _addObjectRestIssues } from './_addObjectRestIssues.ts';

describe('_addObjectRestIssues', () => {
  const input = { key1: 'foo', key2: 1, key3: 234, key4: 5 };
  const schema = objectWithRest(
    { key1: string() },
    pipe(number(), minValue(100))
  );

  type Schema = typeof schema;
  type MinValue100Issue = MinValueIssue<number, 100>;

  const baseInfo = {
    kind: 'validation',
    type: 'min_value',
    expected: '>=100',
    message: expect.any(String),
    requirement: 100,
    issues: undefined,
    lang: undefined,
    abortEarly: undefined,
    abortPipeEarly: undefined,
    skipPipe: undefined,
  } as const;

  const minValueIssue1: MinValue100Issue = {
    ...baseInfo,
    input: 1,
    received: '1',
    path: [
      {
        type: 'object',
        origin: 'value',
        input,
        key: 'key2',
        value: input.key2,
      },
    ],
  };

  const minValueIssue2: MinValue100Issue = {
    ...baseInfo,
    input: 5,
    received: '5',
    path: [
      {
        type: 'object',
        origin: 'value',
        input,
        key: 'key4',
        value: input.key4,
      },
    ],
  };

  test('Should add rest issues to dataset', () => {
    // @ts-expect-error
    const dataset: Dataset<InferInput<Schema>, InferIssue<Schema>> = {
      typed: true,
      value: { key1: 'foo' },
    };
    _addObjectRestIssues(schema, input, dataset, {});
    expect(dataset).toStrictEqual({
      typed: true,
      value: input as unknown as InferOutput<Schema>,
      issues: [minValueIssue1, minValueIssue2],
    } satisfies typeof dataset);
  });

  test('Should abort early if necessary', () => {
    // @ts-expect-error
    const dataset: Dataset<InferInput<Schema>, InferIssue<Schema>> = {
      typed: true,
      value: { key1: 'foo' },
    };
    _addObjectRestIssues(schema, input, dataset, { abortEarly: true });
    expect(dataset).toStrictEqual({
      typed: false,
      value: { key1: 'foo' },
      issues: [{ ...minValueIssue1, abortEarly: true }],
    } satisfies typeof dataset);
  });

  test('Should set typed to false if not typed', () => {
    const input = { key1: 'foo', key2: 'bar' };
    const schema = objectWithRest({ key1: string() }, number());
    type Schema = typeof schema;

    // @ts-expect-error
    const dataset: Dataset<InferInput<Schema>, InferIssue<Schema>> = {
      typed: true,
      value: { key1: 'foo' },
    };
    _addObjectRestIssues(schema, input, dataset, {});
    expect(dataset).toStrictEqual({
      typed: false,
      value: input,
      issues: [
        {
          kind: 'schema',
          type: 'number',
          expected: 'number',
          received: '"bar"',
          input: 'bar',
          message: expect.any(String),
          requirement: undefined,
          path: [
            {
              type: 'object',
              origin: 'value',
              input,
              key: 'key2',
              value: 'bar',
            },
          ],
          issues: undefined,
          lang: undefined,
          abortEarly: undefined,
          abortPipeEarly: undefined,
          skipPipe: undefined,
        },
      ],
    } satisfies typeof dataset);
  });
});
