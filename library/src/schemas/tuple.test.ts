import { describe, expect, test } from 'vitest';
import { parse } from '../methods';
import { tuple } from './tuple';
import { string } from './string';
import { number } from './number';
import { maxLength, minLength } from '../validations';
import { boolean } from './boolean';

describe('tuple', () => {
  test('should pass only tuples', () => {
    const schema1 = tuple([number(), string()]);
    const input1 = [1, 'test'];
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, [])).toThrowError();
    expect(() => parse(schema1, [1])).toThrowError();
    expect(() => parse(schema1, [1, 2])).toThrowError();
    expect(() => parse(schema1, [1, 'test', null])).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, null)).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();

    const schema2 = tuple([string()], number());
    const input2 = ['test'];
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = ['test', 1];
    const output3 = parse(schema2, input3);
    expect(output3).toEqual(input3);
    const input4 = ['test', 1, 2];
    const output4 = parse(schema2, input4);
    expect(output4).toEqual(input4);
    expect(() => parse(schema2, ['test', 'test'])).toThrowError();
    expect(() => parse(schema2, [1, 2])).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a tuple!';
    expect(() => parse(tuple([number()], error), null)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const lengthError = 'Invalid length';

    const schema1 = tuple([string()], number(), [maxLength(3)]);
    const input1 = ['test', 1, 2];
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, ['test', 1, 2, 3])).toThrowError(lengthError);

    const schema2 = tuple([string()], boolean(), 'Error', [
      minLength(2),
      maxLength(3),
    ]);
    const input2 = ['test', true, false];
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, ['test'])).toThrowError(lengthError);
    expect(() => parse(schema2, ['test', true, false, true])).toThrowError(
      lengthError
    );
  });
});
