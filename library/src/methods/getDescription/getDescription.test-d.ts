import { describe, expectTypeOf, test } from 'vitest';
import { description } from '../../actions/index.ts';
import { string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { getDescription } from './getDescription.ts';

describe('getDescription', () => {
  test('should return description', () => {
    expectTypeOf(getDescription(pipe(string()))).toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf(
      getDescription(pipe(string(), description('text')))
    ).toEqualTypeOf<string | undefined>();
    expectTypeOf(
      getDescription(pipe(string(), description('text'), description('text2')))
    ).toEqualTypeOf<string | undefined>();
  });
  test('should work with nested pipes', () => {
    expectTypeOf(
      getDescription(
        pipe(pipe(string(), description('text')), description('text2'))
      )
    ).toEqualTypeOf<string | undefined>();
  });
});
