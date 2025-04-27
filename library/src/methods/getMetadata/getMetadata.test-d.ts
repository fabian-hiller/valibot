import { describe, expectTypeOf, test } from 'vitest';
import { metadata } from '../../actions/index.ts';
import { string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { getMetadata } from './getMetadata.ts';

describe('getMetadata', () => {
  test('should return metadata', () => {
    expectTypeOf(getMetadata(pipe(string()))).toBeUndefined();
    expectTypeOf(
      getMetadata(pipe(string(), metadata({ key: 'foo' })))
    ).toEqualTypeOf<{ readonly key: 'foo' }>();
    expectTypeOf(
      getMetadata(
        pipe(string(), metadata({ key: 'foo' }), metadata({ key2: 'bar' }))
      )
    ).toEqualTypeOf<{ readonly key: 'foo'; readonly key2: 'bar' }>();
  });
  test('should work with nested pipes', () => {
    expectTypeOf(
      getMetadata(
        pipe(
          pipe(string(), metadata({ key: 'foo' })),
          metadata({ key2: 'bar' })
        )
      )
    ).toEqualTypeOf<{ readonly key: 'foo'; readonly key2: 'bar' }>();
  });
});
