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

  test('should expose the pipeline', () => {
    const requirement = new Date(Date.now() + 3600000);
    const schema1 = instance(Date, [maxValue(requirement)]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({
        type: 'max_value',
        requirement,
        message: 'Invalid value',
      }),
    ]);

    const schema2 = instance(Date);
    expect(schema2.pipe).toBeUndefined();
  });

  test('should expose the metadata', () => {
    const schema1 = instance(Date, { description: 'instance value' });
    expect(schema1.metadata).toEqual({ description: 'instance value' });

    const schema2 = instance(Date, {
      description: 'instance value',
      message: 'Value is not a instance!',
    });
    expect(schema2.metadata).toEqual({ description: 'instance value' });
    expect(schema2.message).toEqual('Value is not a instance!');

    const schema3 = instance(Date);
    expect(schema3.metadata).toBeUndefined();
  });
});
