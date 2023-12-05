import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parseAsync } from '../../methods/index.ts';
import { maxLength, minLength } from '../../validations/index.ts';
import { booleanAsync } from '../boolean/index.ts';
import { never } from '../never/index.ts';
import { number, numberAsync } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string } from '../string/index.ts';
import { tupleAsync } from './tupleAsync.ts';

describe('tupleAsync', () => {
  test('should pass only tuples', async () => {
    const schema1 = tupleAsync([number(), string()]);
    const input1 = [1, 'test'];
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    const input2 = [1, 'test', null];
    const output2 = await parseAsync(schema1, input2);
    expect(output2).toEqual([1, 'test']);
    await expect(parseAsync(schema1, [])).rejects.toThrowError();
    await expect(parseAsync(schema1, [1])).rejects.toThrowError();
    await expect(parseAsync(schema1, [1, 2])).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, null)).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();

    const schema2 = tupleAsync([string()], numberAsync());
    const input3 = ['test'];
    const output3 = await parseAsync(schema2, input3);
    expect(output3).toEqual(input3);
    const input4 = ['test', 1];
    const output4 = await parseAsync(schema2, input4);
    expect(output4).toEqual(input4);
    const input5 = ['test', 1, 2];
    const output5 = await parseAsync(schema2, input5);
    expect(output5).toEqual(input5);
    await expect(parseAsync(schema2, ['test', 'test'])).rejects.toThrowError();
    await expect(parseAsync(schema2, [1, 2])).rejects.toThrowError();

    const schema3 = tupleAsync([string()], never());
    const input6 = ['test'];
    const output6 = await parseAsync(schema3, input6);
    expect(output6).toEqual(input6);
    await expect(parseAsync(schema2, ['test', 'test'])).rejects.toThrowError();
    await expect(parseAsync(schema2, ['test', null])).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a tuple!';
    await expect(
      parseAsync(tupleAsync([number()], error), null)
    ).rejects.toThrowError(error);
  });

  test('should throw every issue', async () => {
    const schema = tupleAsync([string(), string(), string()], number());
    const input = [1, '2', 3, '4', 5, '6'];
    await expect(parseAsync(schema, input)).rejects.toThrowError();
    try {
      await parseAsync(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(4);
    }
  });

  test('should throw only first issue', async () => {
    const info = { abortEarly: true };

    const schema1 = tupleAsync([number(), number(), number()]);
    const input1 = ['1', 2, '3'];
    await expect(parseAsync(schema1, input1, info)).rejects.toThrowError();
    try {
      await parseAsync(schema1, input1, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }

    const schema2 = tupleAsync([string()], number());
    const input2 = ['hello', 1, '2', 3, '4'];
    await expect(parseAsync(schema2, input2, info)).rejects.toThrowError();
    try {
      await parseAsync(schema2, input2, info);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', async () => {
    const schema1 = tupleAsync([number(), string(), number()]);
    const input1 = [1, 2, 3];
    const result1 = await schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'tuple',
        input: input1,
        key: 1,
        value: input1[1],
      },
    ]);

    const schema2 = tupleAsync([number(), object({ key: string() })]);
    const input2 = [123, { key: 123 }] as const;
    const result2 = await schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'tuple',
        input: input2,
        key: 1,
        value: input2[1],
      },
      {
        type: 'object',
        input: input2[1],
        key: 'key',
        value: input2[1].key,
      },
    ]);

    const schema3 = tupleAsync([number(), number()], string());
    const input3 = [1, 2, 'test', 123, 'abc'];
    const result3 = await schema3._parse(input3);
    expect(result3.issues?.[0].path).toEqual([
      {
        type: 'tuple',
        input: input3,
        key: 3,
        value: input3[3],
      },
    ]);

    const schema4 = tupleAsync([number(), number()], object({ key: string() }));
    const input4 = [1, 2, { key: 123 }] as const;
    const result4 = await schema4._parse(input4);
    expect(result4.issues?.[0].path).toEqual([
      {
        type: 'tuple',
        input: input4,
        key: 2,
        value: input4[2],
      },
      {
        type: 'object',
        input: input4[2],
        key: 'key',
        value: input4[2].key,
      },
    ]);
  });

  test('should execute pipe', async () => {
    const lengthError = 'Invalid length';

    const schema1 = tupleAsync([string()], number(), [maxLength(3)]);
    const input1 = ['test', 1, 2];
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(parseAsync(schema1, ['test', 1, 2, 3])).rejects.toThrowError(
      lengthError
    );

    const schema2 = tupleAsync([string()], booleanAsync(), 'Error', [
      minLength(2),
      maxLength(3),
    ]);
    const input2 = ['test', true, false];
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(parseAsync(schema2, ['test'])).rejects.toThrowError(
      lengthError
    );
    await expect(
      parseAsync(schema2, ['test', true, false, true])
    ).rejects.toThrowError(lengthError);
  });

  test('should expose the pipeline', () => {
    const schema1 = tupleAsync([string()], [minLength(2), maxLength(3)]);
    expect(schema1.pipe).toStrictEqual([
      expect.objectContaining({
        type: 'min_length',
        requirement: 2,
        message: 'Invalid length',
      }),
      expect.objectContaining({
        type: 'max_length',
        requirement: 3,
        message: 'Invalid length',
      }),
    ]);

    const schema2 = tupleAsync([string()]);
    expect(schema2.pipe).toBeUndefined();
  });

  test('should execute pipe if output is typed', async () => {
    const schema = tupleAsync([string([minLength(10)])], number(), [
      minLength(10),
    ]);
    const input = ['12345'];
    const result = await schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: input,
      issues: [
        {
          reason: 'string',
          validation: 'min_length',
          origin: 'value',
          message: 'Invalid length',
          input: input[0],
          requirement: 10,
          path: [
            {
              type: 'tuple',
              input: input,
              key: 0,
              value: input[0],
            },
          ],
        },
        {
          reason: 'tuple',
          validation: 'min_length',
          origin: 'value',
          message: 'Invalid length',
          input: input,
          requirement: 10,
        },
      ],
    });
  });

  test('should skip pipe if output is not typed', async () => {
    const schema = tupleAsync([string()], number(), [minLength(10)]);
    const input = [12345];
    const result = await schema._parse(input);
    expect(result).toEqual({
      typed: false,
      output: input,
      issues: [
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          message: 'Invalid type',
          input: input[0],
          path: [
            {
              type: 'tuple',
              input: input,
              key: 0,
              value: input[0],
            },
          ],
        },
      ],
    });
  });
});
