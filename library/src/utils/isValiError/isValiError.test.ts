import { describe, expect, test } from 'vitest';
import { ValiError } from '../../error/index.ts';
import type { StringIssue } from '../../schemas/index.ts';
import { isValiError } from './isValiError.ts';

describe('isValiError', () => {
  test('should return true if ValiError', () => {
    expect(
      isValiError(
        new ValiError([
          {
            kind: 'schema',
            type: 'string',
            input: null,
            expected: 'string',
            received: 'null',
            message: 'Invalid type: Expected string but received null',
          } satisfies StringIssue,
        ])
      )
    ).toBe(true);
  });

  test('should return false if other error', () => {
    expect(isValiError(new Error())).toBe(false);
    expect(isValiError(new TypeError())).toBe(false);
    expect(isValiError(new RangeError())).toBe(false);
  });
});
