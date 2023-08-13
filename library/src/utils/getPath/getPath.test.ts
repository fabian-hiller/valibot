import { describe, expect, test } from 'vitest';
import { getPath } from './getPath.ts';
import type { PathItem } from '../../types.ts';

describe('getPath', () => {
  test('should return current path', () => {
    const item: PathItem = {
      schema: 'object',
      input: { test: 123 },
      key: 'test',
      value: 123,
    };
    expect(getPath(undefined, item)).toEqual([item]);
    expect(getPath([item], item)).toEqual([item, item]);
  });
});
