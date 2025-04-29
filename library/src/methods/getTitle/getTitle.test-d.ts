import { describe, expectTypeOf, test } from 'vitest';
import { title } from '../../actions/index.ts';
import { string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { getTitle } from './getTitle.ts';

describe('getTitle', () => {
  test('should return title', () => {
    expectTypeOf(getTitle(pipe(string()))).toEqualTypeOf<string | undefined>();
    expectTypeOf(getTitle(pipe(string(), title('text')))).toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf(
      getTitle(pipe(string(), title('text'), title('text2')))
    ).toEqualTypeOf<string | undefined>();
  });
  test('should work with nested pipes', () => {
    expectTypeOf(
      getTitle(pipe(pipe(string(), title('text')), title('text2')))
    ).toEqualTypeOf<string | undefined>();
  });
});
