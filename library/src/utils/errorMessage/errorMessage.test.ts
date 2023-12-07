import { describe, expect, test } from 'vitest';
import { errorMessage } from './errorMessage.ts';

describe('errorMessage', () => {
  test('should return the final string', () => {
    const message = 'test';
    expect(errorMessage(message)).toBe(message);
    expect(errorMessage(() => message)).toBe(message);
  });
});
