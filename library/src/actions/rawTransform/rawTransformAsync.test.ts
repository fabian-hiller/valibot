import { describe, expect, test } from 'vitest';
import {
  type RawTransformActionAsync,
  rawTransformAsync,
} from './rawTransformAsync.ts';

describe('rawTransformAsync', () => {
  const action = rawTransformAsync<string, number>(
    async ({ dataset, addIssue, NEVER }) => {
      const length = dataset.value.length;
      if (length < 3) {
        addIssue({ message: 'message' });
        return NEVER;
      }
      return length;
    }
  );

  test('should return action object', () => {
    expect(action).toStrictEqual({
      kind: 'transformation',
      type: 'raw_transform',
      reference: rawTransformAsync,
      async: true,
      '~run': expect.any(Function),
    } satisfies RawTransformActionAsync<string, number>);
  });

  describe('should return dataset without issues', () => {
    test('for valid inputs', async () => {
      expect(
        await action['~run']({ typed: true, value: 'foo' }, {})
      ).toStrictEqual({
        typed: true,
        value: 3,
      });
      expect(
        await action['~run']({ typed: true, value: '123456789' }, {})
      ).toStrictEqual({
        typed: true,
        value: 9,
      });
    });
  });

  describe('should return dataset with issues', () => {
    test('for invalid inputs', async () => {
      expect(
        await action['~run']({ typed: true, value: 'fo' }, {})
      ).toStrictEqual({
        typed: false,
        value: 'fo',
        issues: [
          {
            kind: 'transformation',
            type: 'raw_transform',
            expected: null,
            message: 'message',
            input: 'fo',
            received: '"fo"',
            requirement: undefined,
            path: undefined,
            issues: undefined,
            lang: undefined,
            abortEarly: undefined,
            abortPipeEarly: undefined,
          },
        ],
      });
    });
  });
});
