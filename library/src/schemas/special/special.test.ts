import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { custom } from '../../validations/index.ts';
import { special } from './special.ts';

type PixelString = `${number}px`;
const isPixelString = (input: unknown) =>
  typeof input === 'string' && /^\d+px$/u.test(input);

describe('special', () => {
  test('should pass only pixel strings', () => {
    const schema = special<PixelString>(isPixelString);
    const input = '12px';
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 12)).toThrowError();
    expect(() => parse(schema, '12')).toThrowError();
    expect(() => parse(schema, 'px')).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not special!';
    expect(() =>
      parse(
        special(() => false, error),
        'test'
      )
    ).toThrowError(error);
  });

  test('should execute pipe', () => {
    const inputError = 'Invalid input';

    const schema1 = special<PixelString>(isPixelString, [
      custom((input) => parseInt(input) >= 10),
    ]);
    const input1 = '10px';
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    expect(() => parse(schema1, '9px')).toThrowError(inputError);

    const schema2 = special<PixelString>(isPixelString, 'Error', [
      custom((input) => parseInt(input) < 10),
    ]);
    const input2 = '9px';
    const output2 = parse(schema2, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema2, '10px')).toThrowError(inputError);
  });

  test('should expose the metadata', () => {
    const schema1 = special<PixelString>(isPixelString, {
      description: 'special value',
    });
    expect(schema1.metadata).toEqual({ description: 'special value' });

    const schema2 = special<PixelString>(isPixelString, {
      description: 'special value',
      message: 'Value is not a special!',
    });
    expect(schema2.metadata).toEqual({ description: 'special value' });
    expect(schema2.message).toEqual('Value is not a special!');

    const schema3 = special<PixelString>(isPixelString);
    expect(schema3.metadata).toBeUndefined();
  });
});
