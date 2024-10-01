import { describe, expect, test } from 'vitest';
import { brand, type BrandAction } from './brand.ts';

describe('brand', () => {
  test('should return action object', () => {
    expect(brand('foo')).toStrictEqual({
      kind: 'transformation',
      type: 'brand',
      reference: brand,
      name: 'foo',
      async: false,
      '~validate': expect.any(Function),
    } satisfies BrandAction<string, 'foo'>);
  });

  test('should return same dataset', () => {
    const dataset = { typed: true, value: 'foo' } as const;
    expect(brand('foo')['~validate'](dataset, {})).toStrictEqual(dataset);
  });
});
