import { describe, expect, test } from 'vitest';
import { parse } from '../methods';
import { bigint } from './bigint';
import { maxRange, minRange } from '../validations';

describe('bigint', () => {
  test('should pass only bigints', () => {
    const schema = bigint();
    const input = 123n;
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, '123')).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a bigint!';
    expect(() => parse(bigint(error), 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const rangeError = 'Invalid range';

    const schema1 = bigint([minRange(1n), maxRange(3n)]);
    const input1 = 2n;
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, 0n)).toThrowError(rangeError);
    expect(() => parse(schema1, 12n)).toThrowError(rangeError);

    const schema2 = bigint('Error', [maxRange(3n)]);
    const input2 = 3n;
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, 12346789n)).toThrowError(rangeError);
  });
});
