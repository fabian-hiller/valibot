import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { email, maxLength, minLength } from '../../validations/index.ts';
import { string } from './string.ts';

describe('string', () => {
  test('should pass only strings', () => {
    const schema = string();
    const input = '';
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 123n)).toThrowError();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a string!';
    expect(() => parse(string(error), 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const lengthError = 'Invalid length';
    const schema1 = string([minLength(1), maxLength(3)]);
    const input1 = '12';
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    expect(() => parse(schema1, '')).toThrowError(lengthError);
    expect(() => parse(schema1, '1234')).toThrowError(lengthError);

    const emailError = 'Invalid email';
    const schema2 = string('Error', [email()]);
    const input2 = 'jane@example.com';
    const output2 = parse(schema2, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema2, 'jane@example')).toThrowError(emailError);
  });

  test('should expose the pipeline', () => {
    const schema1 = string([minLength(2), maxLength(3)]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({
        type: 'min_length',
        requirement: 2,
        message: 'Invalid length',
      }),
      expect.objectContaining({
        type: 'max_length',
        requirement: 3,
        message: 'Invalid length',
      }),
    ]);

    const schema2 = string();
    expect(schema2.pipe).toBeUndefined();
  });

  test('should expose the metadata', () => {
    const schema1 = string({ description: 'string value' });
    expect(schema1.metadata).toEqual({ description: 'string value' });

    const schema2 = string({
      description: 'string value',
      message: 'Value is not a string!',
    });
    expect(schema2.metadata).toEqual({ description: 'string value' });
    expect(schema2.message).toEqual('Value is not a string!');

    const schema3 = string();
    expect(schema3.metadata).toBeUndefined();
  });
});
