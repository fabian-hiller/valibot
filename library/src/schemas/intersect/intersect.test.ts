import { describe, expect, test } from 'vitest';
import type { ValiError } from '../../error/index.ts';
import { parse, transform } from '../../methods/index.ts';
import { literal } from '../literal/index.ts';
import { object } from '../object/index.ts';
import { record } from '../record/index.ts';
import { string } from '../string/index.ts';
import { unknown } from '../unknown/index.ts';
import { intersect, type IntersectOptions } from './intersect.ts';

describe('intersect', () => {
  test('should pass only intersect values', () => {
    const schema1 = intersect([string(), literal('test')]);
    const input1 = 'test';
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    expect(() => parse(schema1, 'foo')).toThrowError();
    expect(() => parse(schema1, undefined)).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();
    expect(() => parse(schema1, [])).toThrowError();

    const schema2 = intersect([
      object({ foo: string() }),
      object({ bar: string() }),
    ]);
    const input2 = { foo: 'test', bar: 'test' };
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, { foo: 'test' })).toThrowError();
    expect(() => parse(schema2, { bar: 'test' })).toThrowError();

    const schema3 = intersect([
      object({ key1: string() }),
      record(string(), unknown()),
    ]);
    const input3 = { key1: 'test', keyX: 123 };
    const output3 = parse(schema3, input3);
    expect(output3).toEqual(input3);
    expect(() => parse(schema3, { keyX: 123 })).toThrowError();
    expect(() => parse(schema3, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an intersect!';
    const options: IntersectOptions = [
      string(),
      transform(string(), (input) => input.length),
    ];
    expect(() => parse(intersect(options), 'test')).toThrowError(
      'Invalid type'
    );
    expect(() => parse(intersect(options, error), 'test')).toThrowError(error);
  });

  test('should throw every issue', () => {
    const schema = intersect([string(), literal('test')]);
    const input = 123;
    expect(() => parse(schema, input)).toThrowError();
    try {
      parse(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', () => {
    const schema = intersect([string(), literal('test')]);
    const input = 123;
    const info = { abortEarly: true };
    expect(() => parse(schema, input, info)).toThrowError();
    try {
      parse(schema, input, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });
});
