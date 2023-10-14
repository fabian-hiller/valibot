import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { maxValue, minValue } from '../../validations/index.ts';
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
    const valueError = 'Invalid value';

    const schema1 = instance(Date, [
      minValue(new Date(Date.now() - 3600000)),
      maxValue(new Date(Date.now() + 3600000)),
    ]);
    const input1 = new Date();
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, new Date(Date.now() - 4000000))).toThrowError(
      valueError
    );
    expect(() => parse(schema1, new Date(Date.now() + 4000000))).toThrowError(
      valueError
    );

    const schema2 = instance(Date, 'Error', [maxValue(new Date())]);
    const input2 = new Date(Date.now() - 120000);
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, new Date(Date.now() + 1))).toThrowError(
      valueError
    );
  });

  test(`should expose a pipe of transforms and validations`, () => {
    const requirement = new Date(Date.now() + 3600000);
    const schema1 = instance(Date, [maxValue(requirement)]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({
        kind: 'max_value',
        requirement,
        message: 'Invalid value',
      }),
    ]);

    const schema2 = instance(Date);
    expect(schema2.pipe).toStrictEqual([]);
  });
});
