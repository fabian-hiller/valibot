import { describe, expect, test } from 'vitest';
import { parse } from '../../methods';
import { number } from '../number';
import { string } from '../string';
import { object } from '../object';
import { optional } from '../optional';
import { passthrough } from './passthrough';

describe('passthrough', () => {
  test('should check objects shape', () => {
    const schema = passthrough(object({ key1: string(), key2: number() }));
    const input = { key1: 'test', key2: 123 };
    const output = parse(schema, input);
    expect(output).toEqual(input);
    expect(() => parse(schema, undefined)).toThrowError();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, 'test')).toThrowError();
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, { key1: 'test' })).toThrowError();
    expect(() => parse(schema, { key1: '', key2: '123' })).toThrowError();
    expect(() => parse(schema, { key1: true, key2: 123 })).toThrowError();
  });

  test('should keep extra props', () => {
    const schema = passthrough(
      object({ key1: string(), key2: optional(number()) })
    );
    const input = {
      key1: 'test',
      key2: 123,
      key3: true,
      key4() {
        console.log('keep function');
      },
    };
    const output = parse(schema, input);
    expect(output).toEqual(input);
    expect(output.key3).toBeTruthy();
    expect(output.key4).toBe(input.key4);
    expect(() => parse(schema, undefined)).toThrowError();
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, false)).toThrowError();
    expect(() => parse(schema, null)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an object!';
    const schema = passthrough(object({}, error));
    expect(() => parse(schema, 123)).toThrowError(error);
    expect(() => parse(schema, null)).toThrowError(error);
    expect(() => parse(schema, undefined)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const transformInput = (o: any) => ({ ...o, key1: '42' });
    const schema = passthrough(
      object(
        {
          key1: string(),
          key2: optional(number()),
        },
        'Error',
        [transformInput]
      )
    );
    const input1 = { key1: '1', key2: 2 };
    const output1 = parse(schema, input1);
    expect(output1).toEqual(transformInput(input1));
    const input2 = { key1: '1', key3: true };
    const output2 = parse(schema, input2);
    expect(output2).toEqual({ key1: '42', key3: true });
  });
});
