import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parseAsync } from '../../methods/index.ts';
import type {
  Output,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { maxSize, minLength, minSize, size } from '../../validations/index.ts';
import { date } from '../date/index.ts';
import { mapAsync } from '../map/index.ts';
import { number, numberAsync } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string } from '../string/index.ts';

describe('mapAsync', () => {
  test('should pass only maps', async () => {
    const schema1 = mapAsync(string(), date());
    const input1 = new Map().set('1', new Date());
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = mapAsync(number(), string());
    const input2 = new Map().set(1, '1').set(2, '2');
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = new Map();
    const output3 = await parseAsync(schema2, input3);
    expect(output3).toEqual(input3);

    await expect(
      parseAsync(schema1, new Map().set('1', '1'))
    ).rejects.toThrowError();
    await expect(
      parseAsync(schema1, new Map().set(1, '1'))
    ).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an map!';
    const schema = mapAsync(number(), string(), error);
    await expect(parseAsync(schema, new Set())).rejects.toThrowError(error);
  });

  test('should throw every issue', async () => {
    const schema = mapAsync(number(), string());
    const input = new Map().set(1, 1).set(2, '2').set('3', '3');
    await expect(parseAsync(schema, input)).rejects.toThrowError();
    try {
      await parseAsync(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', async () => {
    const schema = mapAsync(number(), string());
    const config = { abortEarly: true };
    const input1 = new Map().set(1, 1).set(2, '2').set('3', '3');
    await expect(parseAsync(schema, input1, config)).rejects.toThrowError();
    try {
      await parseAsync(schema, input1, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
      expect((error as ValiError).issues[0].path?.[0].origin).toBe('value');
    }

    const input2 = new Map().set('1', 1).set(2, '2').set('3', '3');
    await expect(parseAsync(schema, input2, config)).rejects.toThrowError();
    try {
      await parseAsync(schema, input2, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
      expect((error as ValiError).issues[0].path?.[0].origin).toBe('key');
    }
  });

  test('should return issue path', async () => {
    const schema1 = mapAsync(string(), number());
    const input1 = new Map().set('A', 1).set('B', 2).set('C', '3');
    const result1 = await schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'map',
        origin: 'value',
        input: input1,
        key: 'C',
        value: input1.get('C'),
      },
    ]);

    const schema2 = mapAsync(string(), object({ key: string() }));
    const input2 = new Map()
      .set('A', { key: '1' })
      .set('B', { key: 2 })
      .set('C', { key: '3' });
    const result2 = await schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'map',
        origin: 'value',
        input: input2,
        key: 'B',
        value: input2.get('B'),
      },
      {
        type: 'object',
        origin: 'value',
        input: input2.get('B'),
        key: 'key',
        value: input2.get('B').key,
      },
    ]);

    const schema3 = mapAsync(object({ key: string() }), string());
    const errorKey = { key: 2 };
    const input3 = new Map()
      .set({ key: '1' }, 'A')
      .set(errorKey, 'B')
      .set({ key: '3' }, 'C');
    const result3 = await schema3._parse(input3);
    expect(result3.issues?.[0].path).toEqual([
      {
        type: 'map',
        origin: 'key',
        input: input3,
        key: errorKey,
        value: input3.get(errorKey),
      },
      {
        type: 'object',
        origin: 'value',
        input: errorKey,
        key: 'key',
        value: errorKey.key,
      },
    ]);
  });

  test('should execute pipe', async () => {
    const sizeError = 'Invalid size';

    const schema1 = mapAsync(numberAsync(), string(), [size(1)]);
    const input1 = new Map().set(1, '1');
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(parseAsync(schema1, new Map())).rejects.toThrowError(
      sizeError
    );
    await expect(parseAsync(schema1, input1.set(2, '2'))).rejects.toThrowError(
      sizeError
    );

    const schema2 = mapAsync(numberAsync(), string(), 'Error', [
      minSize(2),
      maxSize(4),
    ]);
    const input2 = new Map().set(1, '1').set(2, '2').set(3, '3');
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(
      parseAsync(schema2, input2.set(4, '4').set(5, '5'))
    ).rejects.toThrowError(sizeError);
    await expect(
      parseAsync(schema2, new Map().set(1, '1'))
    ).rejects.toThrowError(sizeError);
  });

  test('should execute pipe if output is typed', async () => {
    const schema = mapAsync(number(), string([minLength(10)]), [minSize(10)]);
    const input = new Map().set(0, '12345');
    const result = await schema._parse(input);
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
          input: input.get(0),
          requirement: 10,
          path: [
            {
              type: 'map',
              origin: 'value',
              input: input,
              key: 0,
              value: input.get(0),
            },
          ],
        },
        {
          reason: 'map',
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

  test('should skip pipe if output is not typed', async () => {
    const schema = mapAsync(number(), string(), [minSize(10)]);
    const input = new Map().set(0, 12345);
    const result = await schema._parse(input);
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
          input: input.get(0),
          path: [
            {
              type: 'map',
              origin: 'value',
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
