import { describe, expect, test } from 'vitest';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { rawCheck, type RawCheckAction } from './rawCheck.ts';
import type { RawCheckIssue } from './types.ts';

describe('rawCheck', () => {
  const action = rawCheck<number>(({ dataset, addIssue }) => {
    if (dataset.typed && dataset.value <= 0) {
      addIssue({ message: 'message' });
    }
  });

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'validation',
      type: 'raw_check',
      reference: rawCheck,
      expects: null,
      async: false,
      '~run': expect.any(Function),
    } satisfies RawCheckAction<number>);
  });

  describe('should return dataset without issues', () => {
    test('for untyped inputs', () => {
      const issues: [StringIssue] = [
        {
          kind: 'schema',
          type: 'string',
          input: null,
          expected: 'string',
          received: 'null',
          message: 'message',
        },
      ];
      expect(
        action['~run']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues,
      });
    });

    test('for valid inputs', () => {
      expectNoActionIssue(action, [1, 12345, Infinity]);
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<RawCheckIssue<number>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'raw_check',
      expected: null,
      message: 'message',
    };

    test('for invalid inputs', () => {
      expectActionIssue(action, baseIssue, [0, -1, -12345, -Infinity]);
    });
  });
});
