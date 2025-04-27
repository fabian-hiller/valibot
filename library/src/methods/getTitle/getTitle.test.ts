import { describe, expect, test } from 'vitest';
import { title } from '../../actions/index.ts';
import { string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { getTitle } from './getTitle.ts';

describe('getTitle', () => {
  test('should return title', () => {
    expect(getTitle(pipe(string()))).toBeUndefined();
    expect(getTitle(pipe(string(), title('text')))).toBe('text');
    expect(getTitle(pipe(string(), title('text'), title('text2')))).toBe(
      'text2'
    );
  });
  test('should work with nested pipes', () => {
    expect(getTitle(pipe(pipe(string(), title('text')), title('text2')))).toBe(
      'text2'
    );
  });
});
