import { describe, expect, test } from 'vitest';
import { getPathInfo } from './getPathInfo.ts';
import type { PathItem } from '../../types.ts';

describe('getPathInfo', () => {
  test('should return pipe info', () => {
    const path: PathItem[] = [
      {
        schema: 'object',
        input: { test: null },
        key: 'test',
        value: null,
      },
    ];
    expect(getPathInfo(undefined, path)).toEqual({
      origin: 'value',
      path,
    });
    expect(getPathInfo(undefined, path, 'key')).toEqual({
      origin: 'key',
      path,
    });
    expect(getPathInfo({ abortEarly: true }, path, 'value')).toEqual({
      origin: 'value',
      path,
      abortEarly: true,
    });
    expect(getPathInfo({ abortPipeEarly: true }, path, 'key')).toEqual({
      origin: 'key',
      path,
      abortPipeEarly: true,
    });
  });
});
