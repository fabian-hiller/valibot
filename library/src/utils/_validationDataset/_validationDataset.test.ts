import { describe, expect, test } from 'vitest';
import { decimal, type DecimalIssue } from '../../actions/index.ts';
import type { Dataset, TypedDataset } from '../../types/index.ts';
import { _validationDataset } from './_validationDataset.ts';

describe('_validationDataset', () => {
  test('should return typed dataset', () => {
    const action = decimal();
    const dataset: Dataset<string, never> = { typed: true, value: '123' };
    expect(
      _validationDataset(
        action,
        decimal,
        'decimal',
        dataset.typed && !action.requirement.test(dataset.value),
        dataset,
        {}
      )
    ).toStrictEqual({ typed: true, value: '123' } satisfies TypedDataset<
      string,
      never
    >);
  });

  test('should return untyped dataset', () => {
    const action = decimal();
    const dataset: Dataset<string, never> = { typed: true, value: 'foo' };
    expect(
      _validationDataset(
        action,
        decimal,
        'decimal',
        dataset.typed && !action.requirement.test(dataset.value),
        dataset,
        {}
      )
    ).toStrictEqual({
      typed: true,
      value: 'foo',
      issues: [
        {
          kind: 'validation',
          type: 'decimal',
          input: 'foo',
          expected: null,
          received: '"foo"',
          message: 'Invalid decimal: Received "foo"',
          path: undefined,
          requirement: action.requirement,
          issues: undefined,
          lang: undefined,
          abortEarly: undefined,
          abortPipeEarly: undefined,
          skipPipe: undefined,
        },
      ],
    } satisfies TypedDataset<string, DecimalIssue<string>>);
  });
});
