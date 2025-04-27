import { describe, expect, test } from 'vitest';
import { description } from '../../actions/index.ts';
import { string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { getDescription } from './getDescription.ts';

describe('getDescription', () => {
  test('should return description', () => {
    expect(getDescription(pipe(string()))).toBeUndefined();
    expect(getDescription(pipe(string(), description('text')))).toBe('text');
    expect(
      getDescription(pipe(string(), description('text'), description('text2')))
    ).toBe('text2');
  });
  test('should work with nested pipes', () => {
    expect(
      getDescription(
        pipe(pipe(string(), description('text')), description('text2'))
      )
    ).toBe('text2');
  });
});
