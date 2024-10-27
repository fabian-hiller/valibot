import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { number, object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { assert } from './assert.ts';

describe('assert', () => {
  const entries = {
    key: pipe(
      string(),
      transform((input) => input.length)
    ),
  };

  test('should not throw for valid input', () => {
    expect(() => assert(string(), 'foo')).not.toThrowError();
    expect(() => assert(number(), 123)).not.toThrowError();
    expect(() => assert(object(entries), { key: 'foo' })).not.toThrowError();
  });

  test('should throw for invalid input', () => {
    expect(() => assert(string(), 123)).toThrowError();
    expect(() => assert(number(), 'foo')).toThrowError();
    expect(() => assert(object(entries), null)).toThrowError();
  });
});
