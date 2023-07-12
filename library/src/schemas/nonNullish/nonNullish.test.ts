import { describe, expect, test } from 'vitest';
import { parse } from '../../methods';
import { union } from '../union';
import { string } from '../string';
import { nullType } from '../nullType';
import { number } from '../number';
import { any } from '../any';
import { undefinedType } from '../undefinedType';
import { nullish } from '../nullish';
import { nonNullish } from './nonNullish';

describe('nonNullish', () => {
  test('should not pass null or undefined', () => {
    const schema1 = nonNullish(union([string(), nullType(), undefinedType()]));
    const input1 = 'test';
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    expect(() => parse(schema1, null)).toThrowError();
    expect(() => parse(schema1, undefined)).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();

    const schema2 = nonNullish(nullish(number()));
    const input2 = 123;
    const output2 = parse(schema2, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema2, null)).toThrowError();
    expect(() => parse(schema2, undefined)).toThrowError();
    expect(() => parse(schema2, 'test')).toThrowError();
    expect(() => parse(schema2, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not non nullish!';
    expect(() => parse(nonNullish(any(), error), null)).toThrowError(error);
  });
});
