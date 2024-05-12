import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parse } from '../../methods/index.ts';
import type {
  Output,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { maxSize, minLength, minSize, size } from '../../validations/index.ts';
import { date } from '../date/index.ts';
import { number } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string } from '../string/index.ts';
import { set } from './set.ts';

describe('set', () => {
  test('should pass only sets', () => {
    const schema1 = set(string());
    const input1 = new Set().add('hello');
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = set(date());
    const input2 = new Set().add(new Date()).add(new Date());
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = new Set();
    const output3 = parse(schema2, input3);
    expect(output3).toEqual(input3);

    expect(() => parse(schema1, new Set().add(123))).toThrowError();
    expect(() =>
      parse(schema1, new Set().add('hello').add(123))
    ).toThrowError();
    expect(() => parse(schema1, new Map())).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, 'test')).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a set!';
    const schema = set(number(), error);
    expect(() => parse(schema, 'test')).toThrowError(error);
  });

  test('should throw every issue', () => {
    const schema = set(number());
    const input = new Set().add('1').add(2).add('3');
    expect(() => parse(schema, input)).toThrowError();
    try {
      parse(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', () => {
    const schema = set(number());
    const input = new Set().add('1').add(2).add('3');
    const config = { abortEarly: true };
    expect(() => parse(schema, input, config)).toThrowError();
    try {
      parse(schema, input, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', () => {
    const schema1 = set(number());
    const input1 = new Set().add(1).add('2').add(3);
    const result1 = schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'set',
        origin: 'value',
        input: input1,
        key: 1,
        value: '2',
      },
    ]);

    const schema2 = set(object({ key: string() }));
    const input2 = new Set().add({ key: 'hello' }).add({ key: 123 });
    const result2 = schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'set',
        origin: 'value',
        input: input2,
        key: 1,
        value: { key: 123 },
      },
      {
        type: 'object',
        origin: 'value',
        input: { key: 123 },
        key: 'key',
        value: 123,
      },
    ]);
  });

  test('should execute pipe', () => {
    const sizeError = 'Invalid size';

    const schema1 = set(number(), [size(1)]);
    const input1 = new Set().add(1);
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, new Set())).toThrowError(sizeError);
    expect(() => parse(schema1, input1.add(2))).toThrowError(sizeError);

    const schema2 = set(string(), 'Error', [minSize(2), maxSize(4)]);
    const input2 = new Set().add('1').add('2').add('3');
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, input2.add('4').add('5'))).toThrowError(
      sizeError
    );
    expect(() => parse(schema2, new Set().add('1'))).toThrowError(sizeError);
  });

  test('should execute pipe if output is typed', () => {
    const schema = set(string([minLength(10)]), [minSize(10)]);
    const input = new Set<string>().add('12345');
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: input,
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
              type: 'set',
              origin: 'value',
              input: input,
              key: 0,
              value: '12345',
            },
          ],
        },
        {
          reason: 'set',
          context: 'min_size',
          expected: '>=10',
          received: '1',
          message: 'Invalid size: Expected >=10 but received 1',
          input: input,
          requirement: 10,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
  });

  test('should skip pipe if output is not typed', () => {
    const schema = set(string(), [minSize(10)]);
    const input = new Set().add(12345);
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: false,
      output: input,
      issues: [
        {
          reason: 'type',
          context: 'string',
          expected: 'string',
          received: '12345',
          message: 'Invalid type: Expected string but received 12345',
          input: 12345,
          path: [
            {
              type: 'set',
              origin: 'value',
              input: input,
              key: 0,
              value: 12345,
            },
          ],
        },
      ],
    } satisfies UntypedSchemaResult);
  });

  test('should expose the metadata', () => {
    const schema1 = set(number(), { description: 'set value' });
    expect(schema1.metadata).toEqual({ description: 'set value' });

    const schema2 = set(number(), {
      description: 'set value',
      message: 'Value is not a set!',
    });
    expect(schema2.metadata).toEqual({ description: 'set value' });
    expect(schema2.message).toEqual('Value is not a set!');

    const schema3 = set(number());
    expect(schema3.metadata).toBeUndefined();
  });
});
