import { describe, expect, test } from 'vitest';
import { _joinExpects } from './_joinExpects.ts';

describe('_joinExpects', () => {
  test('should remove duplicates', () => {
    expect(_joinExpects(['"foo"', '"foo"'], '|')).toBe('"foo"');
    expect(_joinExpects(['"foo"', 'string', '"foo"'], '&')).toBe(
      '("foo" & string)'
    );
  });

  test('should join multiple items', () => {
    expect(_joinExpects(['"foo"', 'string'], '&')).toBe('("foo" & string)');
    expect(_joinExpects(['"foo"', 'number', 'boolean', 'Object'], '|')).toBe(
      '("foo" | number | boolean | Object)'
    );
  });

  test('should return first item if only one', () => {
    expect(_joinExpects(['"foo"'], '|')).toBe('"foo"');
    expect(_joinExpects(['string'], '&')).toBe('string');
  });

  test('should return "never" if empty', () => {
    expect(_joinExpects([], '|')).toBe('never');
    expect(_joinExpects([], '&')).toBe('never');
  });
});
