import { describe, expect, test } from 'vitest';
import { number, object, optional, string } from '../../schemas';
import { is } from './is';

describe('is', () => {
  test('Should type guard', () => {
    const schema = object({
      number: number(),
      string: string(),
      object: object({
        optional: optional(string()),
      }),
    });
    expect(
      is(schema, {
        number: 1,
        string: '1',
        object: { optional: '2' },
      })
    ).toBe(true);
    expect(
      is(schema, { number: 1, string: '1', object: { optional: '2' } })
    ).toBe(true);
    expect(is(schema, { number: 1, string: '1', object: {} })).toBe(true);
    expect(is(schema, { number: 1, string: '1' })).toBe(false);
    expect(is(schema, undefined)).toBe(false);
    expect(
      is(schema, { number: 1, string: '1', object: {}, additional: true })
    ).toBe(true);
  });
});
