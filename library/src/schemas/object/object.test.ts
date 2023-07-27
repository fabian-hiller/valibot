import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { number } from '../number/index.ts';
import { string } from '../string/index.ts';
import { object } from './object.ts';

describe('object', () => {
  test('should pass only objects', () => {
    const schema = object({ key1: string(), key2: number() });
    const input = { key1: 'test', key2: 123 };
    const output = parse(schema, input);
    expect(output).toEqual(input);
    expect(() => parse(schema, 'test')).toThrowError();
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
    expect(() => parse(schema, new Map())).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an object!';
    const schema = object({}, error);
    expect(() => parse(schema, 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const input = { key1: '1', key2: 1 };
    const transformInput = () => ({ key1: '2', key2: 2 });
    const output1 = parse(
      object({ key1: string(), key2: number() }, [transformInput]),
      input
    );
    const output2 = parse(
      object({ key1: string(), key2: number() }, 'Error', [transformInput]),
      input
    );
    expect(output1).toEqual(transformInput());
    expect(output2).toEqual(transformInput());
  });
});
