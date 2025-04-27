import { describe, expect, test } from 'vitest';
import { metadata } from '../../actions/index.ts';
import { string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { getMetadata } from './getMetadata.ts';

describe('getMetadata', () => {
  test('should return metadata', () => {
    expect(getMetadata(pipe(string()))).toBeUndefined();
    expect(getMetadata(pipe(string(), metadata({ key: 'foo' })))).toStrictEqual(
      { key: 'foo' }
    );
    expect(
      getMetadata(
        pipe(string(), metadata({ key: 'foo' }), metadata({ key2: 'bar' }))
      )
    ).toStrictEqual({ key: 'foo', key2: 'bar' });
  });
  test('should work with nested pipes', () => {
    expect(
      getMetadata(
        pipe(
          pipe(string(), metadata({ key: 'foo' })),
          metadata({ key2: 'bar' })
        )
      )
    ).toStrictEqual({ key: 'foo', key2: 'bar' });
  });
});
