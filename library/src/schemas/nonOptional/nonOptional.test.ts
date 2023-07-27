import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { union } from '../union/index.ts';
import { string } from '../string/index.ts';
import { nullType } from '../nullType/index.ts';
import { number } from '../number/index.ts';
import { any } from '../any/index.ts';
import { undefinedType } from '../undefinedType/index.ts';
import { optional } from '../optional/index.ts';
import { nonOptional } from './nonOptional.ts';

describe('nonOptional', () => {
  test('should not pass undefined', () => {
    const schema1 = nonOptional(union([string(), nullType(), undefinedType()]));
    const input1 = 'test';
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    expect(parse(schema1, null)).toBeNull();
    expect(() => parse(schema1, undefined)).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();

    const schema2 = nonOptional(optional(number()));
    const input2 = 123;
    const output2 = parse(schema2, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema2, null)).toThrowError();
    expect(() => parse(schema2, undefined)).toThrowError();
    expect(() => parse(schema2, 'test')).toThrowError();
    expect(() => parse(schema2, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not non optional!';
    expect(() => parse(nonOptional(any(), error), undefined)).toThrowError(
      error
    );
  });
});
