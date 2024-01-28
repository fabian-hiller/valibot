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
import { number } from '../number/index.ts';
import { object } from '../object/index.ts';
import { string } from '../string/index.ts';
import { setAsync } from './setAsync.ts';

describe('setAsync', () => {
  test('should pass only sets', async () => {
    const schema1 = setAsync(string());
    const input1 = new Set().add('hello');
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);

    const schema2 = setAsync(date());
    const input2 = new Set().add(new Date()).add(new Date());
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = new Set();
    const output3 = await parseAsync(schema2, input3);
    expect(output3).toEqual(input3);

    await expect(
      parseAsync(schema1, new Set().add(123))
    ).rejects.toThrowError();
    await expect(
      parseAsync(schema1, new Set().add('hello').add(123))
    ).rejects.toThrowError();
    await expect(parseAsync(schema1, new Map())).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, 'test')).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not an set!';
    const schema = setAsync(number(), error);
    await expect(parseAsync(schema, 'test')).rejects.toThrowError(error);
  });

  test('should throw every issue', async () => {
    const schema = setAsync(number());
    const input = new Set().add('1').add(2).add('3');
    await expect(parseAsync(schema, input)).rejects.toThrowError();
    try {
      await parseAsync(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(2);
    }
  });

  test('should throw only first issue', async () => {
    const schema = setAsync(number());
    const input = new Set().add('1').add(2).add('3');
    const config = { abortEarly: true };
    await expect(parseAsync(schema, input, config)).rejects.toThrowError();
    try {
      await parseAsync(schema, input, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', async () => {
    const schema1 = setAsync(number());
    const input1 = new Set().add(1).add('2').add(3);
    const result1 = await schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'set',
        input: input1,
        key: 1,
        value: '2',
      },
    ]);

    const schema2 = setAsync(object({ key: string() }));
    const input2 = new Set().add({ key: 'hello' }).add({ key: 123 });
    const result2 = await schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'set',
        input: input2,
        key: 1,
        value: { key: 123 },
      },
      {
        type: 'object',
        input: { key: 123 },
        key: 'key',
        value: 123,
      },
    ]);
  });

  test('should execute pipe', async () => {
    const sizeError = 'Invalid size';

    const schema1 = setAsync(number(), [size(1)]);
    const input1 = new Set().add(1);
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(parseAsync(schema1, new Set())).rejects.toThrowError(
      sizeError
    );
    await expect(parseAsync(schema1, input1.add(2))).rejects.toThrowError(
      sizeError
    );

    const schema2 = setAsync(string(), 'Error', [minSize(2), maxSize(4)]);
    const input2 = new Set().add('1').add('2').add('3');
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    await expect(
      parseAsync(schema2, input2.add('4').add('5'))
    ).rejects.toThrowError(sizeError);
    await expect(parseAsync(schema2, new Set().add('1'))).rejects.toThrowError(
      sizeError
    );
  });

  test('should execute pipe if output is typed', async () => {
    const schema = setAsync(string([minLength(10)]), [minSize(10)]);
    const input = new Set<string>().add('12345');
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
          input: '12345',
          requirement: 10,
          path: [
            {
              type: 'set',
              input: input,
              key: 0,
              value: '12345',
            },
          ],
        },
        {
          reason: 'set',
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

  test('should skip pipe if output is not typed', async () => {
    const schema = setAsync(string(), [minSize(10)]);
    const input = new Set().add(12345);
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
          input: 12345,
          path: [
            {
              type: 'set',
              input: input,
              key: 0,
              value: 12345,
            },
          ],
        },
      ],
    } satisfies UntypedSchemaResult);
  });
});
