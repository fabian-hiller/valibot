import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parseAsync } from '../../methods/index.ts';
import type {
  Output,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import {
  includes,
  length,
  maxLength,
  minLength,
} from '../../validations/index.ts';
import { number, numberAsync } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string } from '../string/index.ts';
import { arrayAsync } from './arrayAsync.ts';

describe('array', () => {
  test('should pass only arrays', async () => {
    const schema1 = arrayAsync(numberAsync());
    const input1 = [1, 2, 3];
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = arrayAsync(schema1);
    const input2 = [input1, input1, input1];
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);

    const input3: number[] = [];
    const output3 = await parseAsync(schema2, input3);
    expect(output3).toEqual(input3);

    await expect(parseAsync(schema1, {})).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema2, input1)).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an array!';
    const schema = arrayAsync(number(), error);
    await expect(parseAsync(schema, 123)).rejects.toThrowError(error);
  });

  test('should throw every issue', async () => {
    const schema = arrayAsync(number());
    const input = ['1', 2, '3'];
    await expect(parseAsync(schema, input)).rejects.toThrowError();
    try {
      await parseAsync(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', async () => {
    const schema = arrayAsync(number());
    const input = ['1', 2, '3'];
    const config = { abortEarly: true };
    await expect(parseAsync(schema, input, config)).rejects.toThrowError();
    try {
      await parseAsync(schema, input, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', async () => {
    const schema1 = arrayAsync(number());
    const input1 = [1, 2, '3', 4];
    const result1 = await schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'array',
        input: input1,
        key: 2,
        value: input1[2],
      },
    ]);

    const schema2 = arrayAsync(object({ key: string() }));
    const input2 = [{ key: '1' }, { key: 2 }, { key: '3' }];
    const result2 = await schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'array',
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
  });

  test('should execute pipe', async () => {
    const lengthError = 'Invalid length';
    const contentError = 'Invalid content';

    const schema1 = arrayAsync(number(), [minLength(1), maxLength(3)]);
    const input1 = [1, 2];
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(parseAsync(schema1, [])).rejects.toThrowError(lengthError);
    await expect(parseAsync(schema1, [1, 2, 3, 4])).rejects.toThrowError(
      lengthError
    );

    const schema2 = arrayAsync(number(), 'Error', [length(1), includes(123)]);
    const input2 = [123];
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(parseAsync(schema2, [1, 2])).rejects.toThrowError(lengthError);
    await expect(parseAsync(schema2, [1])).rejects.toThrowError(contentError);
  });

  test('should execute pipe if output is typed', async () => {
    const schema = arrayAsync(string([minLength(10)]), [minLength(10)]);
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
          expected: '>=10',
          received: '5',
          message: 'Invalid length: Expected >=10 but received 5',
          input: input[0],
          requirement: 10,
          path: [
            {
              type: 'array',
              input: input,
              key: 0,
              value: input[0],
            },
          ],
        },
        {
          reason: 'array',
          validation: 'min_length',
          origin: 'value',
          expected: '>=10',
          received: '1',
          message: 'Invalid length: Expected >=10 but received 1',
          input: input,
          requirement: 10,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
  });

  test('should skip pipe if output is not typed', async () => {
    const schema = arrayAsync(string(), [minLength(10)]);
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
          expected: 'string',
          received: '12345',
          message: 'Invalid type: Expected string but received 12345',
          input: input[0],
          path: [
            {
              type: 'array',
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
