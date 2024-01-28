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
import { map } from '../map/index.ts';
import { number } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string } from '../string/index.ts';

describe('map', () => {
  test('should pass only maps', () => {
    const schema1 = map(string(), date());
    const input1 = new Map().set('1', new Date());
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = map(number(), string());
    const input2 = new Map().set(1, '1').set(2, '2');
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = new Map();
    const output3 = parse(schema2, input3);
    expect(output3).toEqual(input3);

    expect(() => parse(schema1, new Map().set('1', '1'))).toThrowError();
    expect(() => parse(schema1, new Map().set(1, '1'))).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, 'test')).toThrowError();
    expect(() => parse(schema1, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an map!';
    const schema = map(number(), string(), error);
    expect(() => parse(schema, new Set())).toThrowError(error);
  });

  test('should throw every issue', () => {
    const schema = map(number(), string());
    const input = new Map().set(1, 1).set(2, '2').set('3', '3');
    expect(() => parse(schema, input)).toThrowError();
    try {
      parse(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', () => {
    const schema = map(number(), string());
    const config = { abortEarly: true };
    const input1 = new Map().set(1, 1).set(2, '2').set('3', '3');
    expect(() => parse(schema, input1, config)).toThrowError();
    try {
      parse(schema, input1, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
      expect((error as ValiError).issues[0].origin).toBe('value');
    }

    const input2 = new Map().set('1', 1).set(2, '2').set('3', '3');
    expect(() => parse(schema, input2, config)).toThrowError();
    try {
      parse(schema, input2, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
      expect((error as ValiError).issues[0].origin).toBe('key');
    }
  });

  test('should return issue path', () => {
    const schema1 = map(string(), number());
    const input1 = new Map().set('A', 1).set('B', 2).set('C', '3');
    const result1 = schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'map',
        input: input1,
        key: 'C',
        value: input1.get('C'),
      },
    ]);

    const schema2 = map(string(), object({ key: string() }));
    const input2 = new Map()
      .set('A', { key: '1' })
      .set('B', { key: 2 })
      .set('C', { key: '3' });
    const result2 = schema2._parse(input2);
    expect(result2.issues?.[0].origin).toBe('value');
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'map',
        input: input2,
        key: 'B',
        value: input2.get('B'),
      },
      {
        type: 'object',
        input: input2.get('B'),
        key: 'key',
        value: input2.get('B').key,
      },
    ]);

    const schema3 = map(object({ key: string() }), string());
    const errorKey = { key: 2 };
    const input3 = new Map()
      .set({ key: '1' }, 'A')
      .set(errorKey, 'B')
      .set({ key: '3' }, 'C');
    const result3 = schema3._parse(input3);
    expect(result3.issues?.[0].origin).toBe('key');
    expect(result3.issues?.[0].path).toEqual([
      {
        type: 'map',
        input: input3,
        key: errorKey,
        value: input3.get(errorKey),
      },
      {
        type: 'object',
        input: errorKey,
        key: 'key',
        value: errorKey.key,
      },
    ]);
  });

  test('should execute pipe', () => {
    const sizeError = 'Invalid size';

    const schema1 = map(number(), string(), [size(1)]);
    const input1 = new Map().set(1, '1');
    const output1 = parse(schema1, input1);
    expect(output1).toEqual(input1);
    expect(() => parse(schema1, new Map())).toThrowError(sizeError);
    expect(() => parse(schema1, input1.set(2, '2'))).toThrowError(sizeError);

    const schema2 = map(number(), string(), 'Error', [minSize(2), maxSize(4)]);
    const input2 = new Map().set(1, '1').set(2, '2').set(3, '3');
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
    expect(() => parse(schema2, input2.set(4, '4').set(5, '5'))).toThrowError(
      sizeError
    );
    expect(() => parse(schema2, new Map().set(1, '1'))).toThrowError(sizeError);
  });

  test('should execute pipe if output is typed', () => {
    const schema = map(number(), string([minLength(10)]), [minSize(10)]);
    const input = new Map().set(0, '12345');
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: input,
      issues: [
        {
          reason: 'string',
          validation: 'min_length',
          origin: 'value',
          expected: '>=10',
          received: '5',
          message: 'Invalid length: Expected >=10 but received 5',
          input: input.get(0),
          requirement: 10,
          path: [
            {
              type: 'map',
              input: input,
              key: 0,
              value: input.get(0),
            },
          ],
        },
        {
          reason: 'map',
          validation: 'min_size',
          origin: 'value',
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
    const schema = map(number(), string(), [minSize(10)]);
    const input = new Map().set(0, 12345);
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: false,
      output: input,
      issues: [
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          expected: 'string',
          received: '12345',
          message: 'Invalid type: Expected string but received 12345',
          input: input.get(0),
          path: [
            {
              type: 'map',
              input: input,
              key: 0,
              value: input.get(0),
            },
          ],
        },
      ],
    } satisfies UntypedSchemaResult);
  });
});
