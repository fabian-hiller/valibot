import { describe, expect, test } from 'vitest';
import { getErrorMessage } from './getErrorMessage.ts';

describe('getErrorMessage', () => {
  test('should return the final string', () => {
    const message = 'test';
    expect(getErrorMessage(message)).toBe(message);
    expect(getErrorMessage(() => message)).toBe(message);
  });
});
