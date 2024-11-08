import { describe, expect, test } from 'vitest';
import { readonly, type ReadonlyAction } from './readonly.ts';

describe('readonly', () => {
  test('should return action object', () => {
    expect(readonly()).toStrictEqual({
      kind: 'transformation',
      type: 'readonly',
      reference: readonly,
      async: false,
      '~run': expect.any(Function),
    } satisfies ReadonlyAction<{ key: string }>);
  });

  test('should return same dataset', () => {
    const dataset = { typed: true, value: { key: 'foo' } } as const;
    expect(readonly()['~run'](dataset, {})).toStrictEqual(dataset);
  });
});
