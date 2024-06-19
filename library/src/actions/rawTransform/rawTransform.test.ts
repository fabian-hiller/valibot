import { describe, expect, test } from 'vitest';
import { rawTransform, type RawTransformAction } from './rawTransform.ts';

describe('rawTransform', () => {
  const action = rawTransform<string, number>(
    ({ dataset, addIssue, NEVER }) => {
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
      reference: rawTransform,
      async: false,
      _run: expect.any(Function),
    } satisfies RawTransformAction<string, number>);
  });

  describe('should return dataset without issues', () => {
    test('for valid inputs', () => {
      expect(action._run({ typed: true, value: 'foo' }, {})).toStrictEqual({
        typed: true,
        value: 3,
      });
      expect(
        action._run({ typed: true, value: '123456789' }, {})
      ).toStrictEqual({
        typed: true,
        value: 9,
      });
    });
  });

  describe('should return dataset with issues', () => {
    test('for invalid inputs', () => {
      expect(action._run({ typed: true, value: 'fo' }, {})).toStrictEqual({
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
