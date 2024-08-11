import { describe, expect, test } from 'vitest';
import { boolean } from '../../../boolean/boolean.ts';
import { literal } from '../../../literal/literal.ts';
import { number } from '../../../number/index.ts';
import { object } from '../../../object/object.ts';
import { string } from '../../../string/index.ts';
import { variant } from '../../variant.ts';
import { _discriminators } from './_discriminators.ts';

describe('discriminators', () => {
  test('should return empty set', () => {
    expect(_discriminators('type', [])).toStrictEqual([]);
  });

  test('should return set with one key', () => {
    expect(
      _discriminators('type', [object({ type: literal('foo') })])
    ).toStrictEqual(['"foo"']);
  });

  test('should return set with multiple keys', () => {
    expect(
      _discriminators('type', [
        object({ type: string() }),
        object({ type: string() }),
      ])
    ).toStrictEqual(['string', 'string']);

    expect(
      _discriminators('type', [
        object({ type: literal('foo') }),
        variant('type', [object({ type: literal('foo') })]),
      ])
    ).toStrictEqual(['"foo"', '"foo"']);

    expect(
      _discriminators('type', [
        object({ type: literal('foo') }),
        object({ type: literal('bar') }),
        object({ type: literal('baz') }),
      ])
    ).toStrictEqual(['"foo"', '"bar"', '"baz"']);

    expect(
      _discriminators('type', [
        object({ type: string() }),
        object({ type: number() }),
        variant('other', [object({ type: boolean(), other: literal('foo') })]),
      ])
    ).toStrictEqual(['string', 'number', 'boolean']);
  });
});
