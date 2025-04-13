import { describe, expectTypeOf, test } from 'vitest';
import { title } from '../../../actions/index.ts';
import { string } from '../../../schemas/index.ts';
import { pipe } from '../../pipe/index.ts';
import { getTitle } from './getTitle.ts';

describe('getTitle', () => {
  test('should return title', () => {
    expectTypeOf(getTitle(pipe(string()))).toBeUndefined();
    expectTypeOf(
      getTitle(pipe(string(), title('text')))
    ).toEqualTypeOf<'text'>();
    expectTypeOf(
      getTitle(pipe(string(), title('text'), title('text2')))
    ).toEqualTypeOf<'text2'>();
  });
  test('should work with nested pipes', () => {
    expectTypeOf(
      getTitle(pipe(pipe(string(), title('text')), title('text2')))
    ).toEqualTypeOf<'text2'>();
  });
});
