import { describe, expect, test } from 'vitest';
import { LazyPath, getPath } from './getPath.ts';
import type { PathItem } from '../../types.ts';

describe('getPath', () => {
  test('should return current path', () => {
    const item: PathItem = {
      schema: 'object',
      input: { test: 123 },
      key: 'test',
      value: 123,
    };
    const itemParent = new LazyPath(undefined, {
      schema: 'object',
      input: { test: 123 },
      key: 'test',
      value: 123,
    });
    expect(getPath(undefined, item).evaluatedPath).toEqual([item]);
    expect(getPath(itemParent, item).evaluatedPath).toEqual([item, item]);
  });
});
