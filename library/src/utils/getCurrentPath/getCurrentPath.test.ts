import { describe, expect, test } from 'vitest';
import { getCurrentPath } from './getCurrentPath.ts';

describe('getCurrentPath', () => {
  test('should return current path', () => {
    const item = {
      schema: 'object' as const,
      input: { test: 123 },
      key: 'test',
      value: 123,
    };
    expect(getCurrentPath(undefined, item)).toEqual([item]);
    expect(getCurrentPath({ path: [item] }, item)).toEqual([item, item]);
  });
});
