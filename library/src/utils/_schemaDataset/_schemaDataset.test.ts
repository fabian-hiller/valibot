import { describe, expect, test } from 'vitest';
import { string, type StringIssue } from '../../schemas/index.ts';
import type {
  Dataset,
  TypedDataset,
  UntypedDataset,
} from '../../types/index.ts';
import { _schemaDataset } from './_schemaDataset.ts';

describe('_schemaDataset', () => {
  test('should return typed dataset', () => {
    const dataset: Dataset<unknown, never> = { typed: false, value: 'foo' };
    expect(
      _schemaDataset(
        string(),
        string,
        typeof dataset.value === 'string',
        dataset,
        {}
      )
    ).toStrictEqual({ typed: true, value: 'foo' } satisfies TypedDataset<
      string,
      never
    >);
  });

  test('should return untyped dataset', () => {
    const dataset: Dataset<unknown, never> = { typed: false, value: null };
    expect(
      _schemaDataset(
        string(),
        string,
        typeof dataset.value === 'string',
        dataset,
        {}
      )
    ).toStrictEqual({
      typed: false,
      value: null,
      issues: [
        {
          kind: 'schema',
          type: 'string',
          input: null,
          expected: 'string',
          received: 'null',
          message: 'Invalid type: Expected string but received null',
          path: undefined,
          requirement: undefined,
          issues: undefined,
          lang: undefined,
          abortEarly: undefined,
          abortPipeEarly: undefined,
          skipPipe: undefined,
        },
      ],
    } satisfies UntypedDataset<StringIssue>);
  });
});
