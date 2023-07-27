import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { maxRange, minRange } from '../../validations/index.ts';
import { instance } from './instance.ts';

describe('instance', () => {
  test('should pass only valid instances', () => {
    const schema = instance(Date);
    const input = new Date();
    const output = parse(schema, input);
    expect(output).toEqual(input);
    expect(() => parse(schema, 'test')).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
    expect(() => parse(schema, new Map())).toThrowError();
    expect(() => parse(schema, new Error())).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an instance!';
    expect(() => parse(instance(Date, error), 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const rangeError = 'Invalid range';

    const schema1 = instance(Date, [
      minRange(new Date(Date.now() - 3600000)),
      maxRange(new Date(Date.now() + 3600000)),
    ]);
    const input1 = new Date();
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, new Date(Date.now() - 4000000))).toThrowError(
      rangeError
    );
    expect(() => parse(schema1, new Date(Date.now() + 4000000))).toThrowError(
      rangeError
    );

    const schema2 = instance(Date, 'Error', [maxRange(new Date())]);
    const input2 = new Date(Date.now() - 120000);
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, new Date(Date.now() + 1))).toThrowError(
      rangeError
    );
  });
});
