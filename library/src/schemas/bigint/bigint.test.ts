import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { maxValue, minValue } from '../../validations/index.ts';
import { bigint } from './bigint.ts';

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
    const valueError = 'Invalid value';

    const schema1 = bigint([minValue(1n), maxValue(3n)]);
    const input1 = 2n;
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, 0n)).toThrowError(valueError);
    expect(() => parse(schema1, 12n)).toThrowError(valueError);

    const schema2 = bigint('Error', [maxValue(3n)]);
    const input2 = 3n;
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, 12346789n)).toThrowError(valueError);
  });

  test('should expose the pipeline', () => {
    const schema1 = bigint([maxValue(500n)]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({
        type: 'max_value',
        requirement: 500n,
        message: 'Invalid value',
      }),
    ]);

    const schema2 = bigint();
    expect(schema2.pipe).toBeUndefined();
  });

  test('should expose the metadata', () => {
    const schema1 = bigint({ description: 'bigint value' });
    expect(schema1.metadata).toEqual({ description: 'bigint value' });

    const schema2 = bigint({
      description: 'bigint value',
      message: 'Value is not a bigint!',
    });
    expect(schema2.metadata).toEqual({ description: 'bigint value' });
    expect(schema2.message).toEqual('Value is not a bigint!');

    const schema3 = bigint();
    expect(schema3.metadata).toBeUndefined();
  });
});
