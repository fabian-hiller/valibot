import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parse } from '../../methods/index.ts';
import type {
  Output,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { maxLength, minLength } from '../../validations/index.ts';
import { boolean } from '../boolean/index.ts';
import { never } from '../never/index.ts';
import { number } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string } from '../string/index.ts';
import { tuple } from './tuple.ts';

describe('tuple', () => {
  test('should pass only tuples', () => {
    const schema1 = tuple([number(), string()]);
    const input1 = [1, 'test'];
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    const input2 = [1, 'test', null];
    const output2 = parse(schema1, input2);
    expect(output2).toEqual([1, 'test']);
    expect(() => parse(schema1, [])).toThrowError();
    expect(() => parse(schema1, [1])).toThrowError();
    expect(() => parse(schema1, [1, 2])).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, null)).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();

    const schema2 = tuple([string()], number());
    const input3 = ['test'];
    const output3 = parse(schema2, input3);
    expect(output3).toEqual(input3);
    const input4 = ['test', 1];
    const output4 = parse(schema2, input4);
    expect(output4).toEqual(input4);
    const input5 = ['test', 1, 2];
    const output5 = parse(schema2, input5);
    expect(output5).toEqual(input5);
    expect(() => parse(schema2, ['test', 'test'])).toThrowError();
    expect(() => parse(schema2, [1, 2])).toThrowError();

    const schema3 = tuple([string()], never());
    const input6 = ['test'];
    const output6 = parse(schema3, input6);
    expect(output6).toEqual(input6);
    expect(() => parse(schema2, ['test', 'test'])).toThrowError();
    expect(() => parse(schema2, ['test', null])).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a tuple!';
    expect(() => parse(tuple([number()], error), null)).toThrowError(error);
  });

  test('should throw every issue', () => {
    const schema = tuple([string(), string(), string()], number());
    const input = [1, '2', 3, '4', 5, '6'];
    expect(() => parse(schema, input)).toThrowError();
    try {
      parse(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(4);
    }
  });

  test('should throw only first issue', () => {
    const config = { abortEarly: true };

    const schema1 = tuple([number(), number(), number()]);
    const input1 = ['1', 2, '3'];
    expect(() => parse(schema1, input1, config)).toThrowError();
    try {
      parse(schema1, input1, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }

    const schema2 = tuple([string()], number());
    const input2 = ['hello', 1, '2', 3, '4'];
    expect(() => parse(schema2, input2, config)).toThrowError();
    try {
      parse(schema2, input2, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', () => {
    const schema1 = tuple([number(), string(), number()]);
    const input1 = [1, 2, 3];
    const result1 = schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'tuple',
        origin: 'value',
        input: input1,
        key: 1,
        value: input1[1],
      },
    ]);

    const schema2 = tuple([number(), object({ key: string() })]);
    const input2 = [123, { key: 123 }] as const;
    const result2 = schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'tuple',
        origin: 'value',
        input: input2,
        key: 1,
        value: input2[1],
      },
      {
        type: 'object',
        origin: 'value',
        input: input2[1],
        key: 'key',
        value: input2[1].key,
      },
    ]);

    const schema3 = tuple([number(), number()], string());
    const input3 = [1, 2, 'test', 123, 'abc'];
    const result3 = schema3._parse(input3);
    expect(result3.issues?.[0].path).toEqual([
      {
        type: 'tuple',
        origin: 'value',
        input: input3,
        key: 3,
        value: input3[3],
      },
    ]);

    const schema4 = tuple([number(), number()], object({ key: string() }));
    const input4 = [1, 2, { key: 123 }] as const;
    const result4 = schema4._parse(input4);
    expect(result4.issues?.[0].path).toEqual([
      {
        type: 'tuple',
        origin: 'value',
        input: input4,
        key: 2,
        value: input4[2],
      },
      {
        type: 'object',
        origin: 'value',
        input: input4[2],
        key: 'key',
        value: input4[2].key,
      },
    ]);
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

  test('should execute pipe if output is typed', () => {
    const schema = tuple([string([minLength(10)])], number(), [minLength(5)]);
    const input: [string] = ['12345'];
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
          input: input[0],
          requirement: 10,
          path: [
            {
              type: 'tuple',
              origin: 'value',
              input: input,
              key: 0,
              value: input[0],
            },
          ],
        },
        {
          reason: 'tuple',
          context: 'min_length',
          expected: '>=5',
          received: '1',
          message: 'Invalid length: Expected >=5 but received 1',
          input: input,
          requirement: 5,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
  });

  test('should skip pipe if output is not typed', () => {
    const schema = tuple([string()], number(), [minLength(10)]);
    const input: [number] = [12345];
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
          input: input[0],
          path: [
            {
              type: 'tuple',
              origin: 'value',
              input: input,
              key: 0,
              value: input[0],
            },
          ],
        },
      ],
    } satisfies UntypedSchemaResult);
  });
});
