import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parse } from '../../methods/index.ts';
import type {
  Output,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { custom, minLength } from '../../validations/index.ts';
import { array } from '../array/array.ts';
import { boolean } from '../boolean/boolean.ts';
import { date } from '../date/date.ts';
import { instance } from '../instance/instance.ts';
import { nullable } from '../nullable/nullable.ts';
import { number } from '../number/index.ts';
import { object } from '../object/object.ts';
import { optional } from '../optional/optional.ts';
import { string } from '../string/index.ts';
import { formData } from './formData.ts';

describe('formData', () => {
  test('should pass only FormData', () => {
    const schema = formData({ foo: string() });
    const input = new FormData();
    input.append('foo', 'bar');
    const output = parse(schema, input);
    expect(output).toEqual({ foo: 'bar' });

    expect(() => parse(schema, {})).toThrowError();
    expect(() => parse(schema, 123)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a FormData!';
    const schema = formData({ n: number() }, error);
    expect(() => parse(schema, 123)).toThrowError(error);
  });

  test('should throw every issue', () => {
    const schema = formData({ a: number(), b: string(), c: number() });
    const input = new FormData();
    input.append('a', 'x');
    input.append('b', 'y');
    input.append('c', 'z');
    expect(() => parse(schema, input)).toThrowError();
    try {
      parse(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', () => {
    const schema1 = formData({ a: number(), b: string(), c: number() });
    const input1 = new FormData();
    input1.append('a', 'x');
    input1.append('b', 'y');
    input1.append('c', 'z');
    const config = { abortEarly: true };
    expect(() => parse(schema1, input1, config)).toThrowError();
    try {
      parse(schema1, input1, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }

    const schema2 = formData({ a: array(number()) });
    const input2 = new FormData();
    input2.append('a', '1');
    input2.append('a', '2');
    input2.append('a', 'x');
    expect(() => parse(schema2, input2, config)).toThrowError();
    try {
      parse(schema2, input2, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }

    const schema3 = formData({ a: array(number()) });
    const input3 = new FormData();
    input3.append('a.0', '1');
    input3.append('a.1', '2');
    input3.append('a.2', 'x');
    expect(() => parse(schema3, input3, config)).toThrowError();
    try {
      parse(schema3, input3, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', () => {
    const schema1 = formData({ a: number() });
    const input1 = new FormData();
    input1.append('a', 'x');
    const result1 = schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'formData',
        origin: 'value',
        input: input1,
        key: 'a',
        value: 'x',
      },
    ]);

    const schema2 = formData({ a: object({ b: number() }) });
    const input2 = new FormData();
    input2.append('a', 'x');
    const result2 = schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'formData',
        origin: 'value',
        input: input2,
        key: 'a',
        value: 'x',
      },
      {
        type: 'formData',
        origin: 'value',
        input: input2,
        key: 'a.b',
        value: null,
      },
    ]);
  });

  test('should execute pipe', () => {
    const inputError = 'Invalid input';

    const schema1 = formData({ a: optional(string()), b: optional(string()) }, [
      custom((input) => Object.keys(input).length === 1),
    ]);
    const input1 = new FormData();
    input1.append('a', 'x');
    const input2 = new FormData();
    const input3 = new FormData();
    input3.append('a', 'x');
    input3.append('b', 'y');
    const output1 = parse(schema1, input1);
    expect(output1).toEqual({ a: 'x' });
    expect(() => parse(schema1, input2)).toThrowError(inputError);
    expect(() => parse(schema1, input3)).toThrowError(inputError);

    const schema2 = formData(
      { a: optional(string()), b: optional(string()) },
      'Error',
      [custom((input) => Object.keys(input).length === 1)]
    );
    const output2 = parse(schema2, input1);
    expect(output2).toEqual({ a: 'x' });
    expect(() => parse(schema2, input2)).toThrowError(inputError);
    expect(() => parse(schema2, input3)).toThrowError(inputError);
  });

  test('should execute pipe if output is typed', () => {
    const requirement1 = (input: { a: string }) =>
      Object.keys(input).length > 10;
    const schema1 = formData({ a: string([minLength(10)]) }, [
      custom(requirement1),
    ]);
    const input1 = new FormData();
    input1.append('a', '12345');
    const result1 = schema1._parse(input1);
    expect(result1).toEqual({
      typed: true,
      output: { a: '12345' },
      issues: [
        {
          reason: 'string',
          context: 'min_length',
          expected: '>=10',
          received: '5',
          message: 'Invalid length: Expected >=10 but received 5',
          input: '12345',
          requirement: 10,
          path: [
            {
              type: 'formData',
              origin: 'value',
              input: input1,
              key: 'a',
              value: '12345',
            },
          ],
        },
        {
          reason: 'formData',
          context: 'custom',
          expected: null,
          received: 'Object',
          message: 'Invalid input: Received Object',
          input: { a: '12345' },
          requirement: requirement1,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema1>>);

    const requirement2 = (input: { a: string[] }) =>
      Object.keys(input).length > 10;
    const schema2 = formData({ a: array(string([minLength(10)])) }, [
      custom(requirement2),
    ]);
    const input2 = new FormData();
    input2.append('a', '123');
    input2.append('a', '12345');
    input2.append('a', '1234567890=');
    const result2 = schema2._parse(input2);
    expect(result2).toEqual({
      typed: true,
      output: { a: ['123', '12345', '1234567890='] },
      issues: [
        {
          reason: 'string',
          context: 'min_length',
          expected: '>=10',
          received: '3',
          message: 'Invalid length: Expected >=10 but received 3',
          input: '123',
          requirement: 10,
          path: [
            {
              type: 'formData',
              origin: 'value',
              input: input2,
              key: 'a',
              value: ['123', '12345', '1234567890='],
            },
          ],
        },
        {
          reason: 'formData',
          context: 'custom',
          expected: null,
          received: 'Object',
          message: 'Invalid input: Received Object',
          input: { a: ['123', '12345', '1234567890='] },
          requirement: requirement2,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema2>>);
  });

  test('should skip pipe if output is not typed', () => {
    const schema1 = formData({ a: number() }, [
      custom((input) => Object.keys(input).length > 10),
    ]);
    const input1 = new FormData();
    input1.append('a', '$12345');
    const result1 = schema1._parse(input1);
    expect(result1).toEqual({
      typed: false,
      output: { a: '$12345' },
      issues: [
        {
          reason: 'type',
          context: 'number',
          expected: 'number',
          received: '"$12345"',
          message: 'Invalid type: Expected number but received "$12345"',
          input: '$12345',
          path: [
            {
              type: 'formData',
              origin: 'value',
              input: input1,
              key: 'a',
              value: '$12345',
            },
          ],
        },
      ],
    } satisfies UntypedSchemaResult);

    const schema2 = formData({ a: array(number()) }, [
      custom((input) => Object.keys(input).length > 10),
    ]);
    const input2 = new FormData();
    input2.append('a', '123');
    input2.append('a', '$12345');
    input2.append('a', '$1234567890=');
    const result2 = schema2._parse(input2);
    expect(result2).toEqual({
      typed: false,
      output: { a: [123, '$12345', '$1234567890='] },
      issues: [
        {
          reason: 'type',
          context: 'number',
          expected: 'number',
          received: '"$12345"',
          message: 'Invalid type: Expected number but received "$12345"',
          input: '$12345',
          path: [
            {
              type: 'formData',
              origin: 'value',
              input: input2,
              key: 'a',
              value: [123, '$12345', '$1234567890='],
            },
          ],
        },
      ],
    } satisfies UntypedSchemaResult);
  });

  test('should accept object schema', () => {
    const schema = formData(object({ a: object({ b: number() }) }));
    const input = new FormData();
    input.append('a.b', '123');
    const result = schema._parse(input);
    expect(result.output).toEqual({ a: { b: 123 } });
  });

  test('should decode array', () => {
    const schema1 = formData({
      a: array(number()),
      b: array(number()),
      c: array(array(number())),
      d: array(object({ x: array(number()) })),
      e: array(object({ x: array(number()) })),
      f: nullable(array(number())),
      g: optional(array(number())),
    });
    const input1 = new FormData();
    input1.append('a', '1');
    input1.append('a', '2');
    input1.append('b.0', '3');
    input1.append('b.1', '4');
    input1.append('c.0', '5');
    input1.append('c.0', '6');
    input1.append('c.1', '7');
    input1.append('c.1', '8');
    input1.append('d.0.x', '9');
    input1.append('e.0.x.0', '10');
    input1.append('f', '');
    const result1 = schema1._parse(input1);
    expect(result1.output).toEqual({
      a: [1, 2],
      b: [3, 4],
      c: [
        [5, 6],
        [7, 8],
      ],
      d: [{ x: [9] }],
      e: [{ x: [10] }],
      f: null,
    });
  });

  test('should decode boolean', () => {
    const schema1 = formData({
      a: boolean(),
      b: boolean(),
      c: nullable(boolean()),
      d: optional(boolean()),
    });
    const input1 = new FormData();
    input1.append('a', 'true');
    input1.append('b', 'false');
    input1.append('c', '');
    const result1 = schema1._parse(input1);
    expect(result1.output).toEqual({ a: true, b: false, c: null });

    const schema2 = formData({ a: boolean() });
    const input2 = new FormData();
    input2.append('a', 'x');
    expect(() => parse(schema2, input2)).toThrowError(
      'Invalid type: Expected boolean but received "x"'
    );
  });

  test('should decode date', () => {
    const schema1 = formData({
      a: date(),
      b: date(),
      c: nullable(date()),
      d: optional(date()),
    });
    const input1 = new FormData();
    input1.append('a', '2021-01-01T00:00:00Z');
    input1.append('b', '1609459200000');
    input1.append('c', '');
    const result1 = schema1._parse(input1);
    expect(result1.output).toEqual({
      a: new Date('2021-01-01T00:00:00Z'),
      b: new Date('2021-01-01T00:00:00Z'),
      c: null,
    });

    const schema2 = formData({ a: date() });
    const input2 = new FormData();
    input2.append('a', 'x');
    expect(() => parse(schema2, input2)).toThrowError(
      'Invalid type: Expected Date but received "x"'
    );
  });

  test('should decode file', () => {
    const value = new File(['foo'], 'bar.txt', { type: 'text/plain' });
    const schema1 = formData({ a: instance(File) });
    const input1 = new FormData();
    input1.append('a', new Blob(['123']));
    const result1 = schema1._parse(input1);
    expect(result1.output).toEqual({ a: value });

    const schema2 = formData({ a: instance(File) });
    const input2 = new FormData();
    input2.append('a', 'x');
    expect(() => parse(schema2, input2)).toThrowError(
      'Invalid type: Expected File but received "x"'
    );
  });

  test('should decode number', () => {
    const schema1 = formData({
      a: number(),
      b: number(),
      c: nullable(number()),
      d: optional(number()),
    });
    const input1 = new FormData();
    input1.append('a', '123');
    input1.append('b', '-4.56');
    input1.append('c', '');
    const result1 = schema1._parse(input1);
    expect(result1.output).toEqual({ a: 123, b: -4.56, c: null });

    const schema2 = formData({ a: number() });
    const input2 = new FormData();
    input2.append('a', 'x');
    expect(() => parse(schema2, input2)).toThrowError(
      'Invalid type: Expected number but received "x"'
    );

    const schema3 = formData({ a: number() });
    const input3 = new FormData();
    input3.append('a', 'NaN');
    expect(() => parse(schema3, input3)).toThrowError(
      'Invalid type: Expected number but received "NaN"'
    );
  });

  test('should decode string', () => {
    const schema1 = formData({
      a: string(),
      b: string(),
      c: string(),
      d: string(),
      e: string(),
      f: string(),
      g: nullable(string()),
      h: optional(string()),
    });
    const input1 = new FormData();
    input1.append('a', 'x');
    input1.append('b', '0');
    input1.append('c', 'NaN');
    input1.append('d', 'false');
    input1.append('e', 'null');
    input1.append('f', 'undefined');
    input1.append('g', '');
    const result1 = schema1._parse(input1);
    expect(result1.output).toEqual({
      a: 'x',
      b: '0',
      c: 'NaN',
      d: 'false',
      e: 'null',
      f: 'undefined',
      g: null,
    });

    const schema2 = formData({ a: string() });
    const input2 = new FormData();
    input2.append('a', new File(['foo'], 'bar.txt', { type: 'text/plain' }));
    expect(() => parse(schema2, input2)).toThrowError(
      'Invalid type: Expected string but received File'
    );
  });
});
