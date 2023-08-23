import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { string } from '../string/index.ts';
import { number } from '../number/index.ts';
import { nullType } from '../nullType/index.ts';
import { intersection } from './intersection.ts';
import { literal } from '../literal/index.ts';
import { object } from '../object/index.ts';

describe('intersection', () => {
  test('should pass only intersection values', () => {
    const schema = intersection([string(), literal('test')]);
    const input = 'test';
    const output = parse(schema, input);
    expect(output).toBe(input);

    expect(() => parse(schema, 'foo')).toThrowError();
    expect(() => parse(schema, undefined)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
    expect(() => parse(schema, [])).toThrowError();
  });

  test('should pass only intersection objects', () => {
    const schema = intersection([
      object({
        foo: string(),
      }),
      object({
        bar: string(),
      }),
    ]);

    const input = { foo: 'test', bar: 'test' };
    const output = parse(schema, input);
    expect(output).toEqual(input);

    expect(() => parse(schema, { foo: 'test' })).toThrowError();
    expect(() => parse(schema, { bar: 'test' })).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not in intersection!';
    expect(() =>
      parse(intersection([string(), number()], error), null)
    ).toThrowError(error);
  });
});
