import { describe, expect, test } from 'vitest';
import { type ValiError } from '../../error/index.ts';
import { parseAsync } from '../../methods/index.ts';
import type {
  Output,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { custom, minLength } from '../../validations/index.ts';
import { arrayAsync } from '../array/arrayAsync.ts';
import { booleanAsync } from '../boolean/booleanAsync.ts';
import { dateAsync } from '../date/dateAsync.ts';
import { instanceAsync } from '../instance/instanceAsync.ts';
import { nullableAsync } from '../nullable/nullableAsync.ts';
import { numberAsync } from '../number/numberAsync.ts';
import { objectAsync } from '../object/objectAsync.ts';
import { optionalAsync } from '../optional/optionalAsync.ts';
import { stringAsync } from '../string/stringAsync.ts';
import { formDataAsync } from './formDataAsync.ts';

describe('formData', () => {
  test('should pass only FormData', async () => {
    const schema = formDataAsync({ foo: stringAsync() });
    const input = new FormData();
    input.append('foo', 'bar');
    const output = await parseAsync(schema, input);
    expect(output).toEqual({ foo: 'bar' });

    expect(parseAsync(schema, {})).rejects.toThrowError();
    expect(parseAsync(schema, 123)).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a FormData!';
    const schema = formDataAsync({ n: numberAsync() }, error);
    expect(parseAsync(schema, 123)).rejects.toThrowError(error);
  });

  test('should throw every issue', async () => {
    const schema = formDataAsync({
      a: stringAsync(),
      b: numberAsync(),
      c: arrayAsync(numberAsync()),
      d: objectAsync({ e: numberAsync() }),
    });
    const input = new FormData();
    input.append('a', 'x');
    input.append('b', 'x');
    input.append('c', 'x');
    input.append('d.e', 'x');
    expect(parseAsync(schema, input)).rejects.toThrowError();
    try {
      await parseAsync(schema, input);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(3);
    }
  });

  test('should throw only first issue', async () => {
    const schema1 = formDataAsync({
      a: numberAsync(),
      b: stringAsync(),
      c: numberAsync(),
    });
    const input1 = new FormData();
    input1.append('a', 'x');
    input1.append('b', 'y');
    input1.append('c', 'z');
    const config = { abortEarly: true };
    expect(parseAsync(schema1, input1, config)).rejects.toThrowError();
    try {
      await parseAsync(schema1, input1, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }

    const schema2 = formDataAsync({ a: arrayAsync(numberAsync()) });
    const input2 = new FormData();
    input2.append('a', '1');
    input2.append('a', '2');
    input2.append('a', 'x');
    expect(parseAsync(schema2, input2, config)).rejects.toThrowError();
    try {
      await parseAsync(schema2, input2, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }

    const schema3 = formDataAsync({ a: arrayAsync(numberAsync()) });
    const input3 = new FormData();
    input3.append('a.0', '1');
    input3.append('a.1', '2');
    input3.append('a.2', 'x');
    expect(parseAsync(schema3, input3, config)).rejects.toThrowError();
    try {
      await parseAsync(schema3, input3, config);
    } catch (error) {
      expect((error as ValiError).issues.length).toBe(1);
    }
  });

  test('should return issue path', async () => {
    const schema1 = formDataAsync({ a: numberAsync() });
    const input1 = new FormData();
    input1.append('a', 'x');
    const result1 = await schema1._parse(input1);
    expect(result1.issues?.[0].path).toEqual([
      {
        type: 'formData',
        origin: 'value',
        input: input1,
        key: 'a',
        value: 'x',
      },
    ]);

    const schema2 = formDataAsync({
      a: objectAsync({ b: stringAsync(), c: numberAsync() }),
    });
    const input2 = new FormData();
    input2.append('a.b', 'x');
    const result2 = await schema2._parse(input2);
    expect(result2.issues?.[0].path).toEqual([
      {
        type: 'formData',
        origin: 'value',
        input: input2,
        key: 'a',
        value: { b: 'x' },
      },
      {
        type: 'formData',
        origin: 'value',
        input: input2,
        key: 'a.c',
        value: null,
      },
    ]);
  });

  test('should execute pipe', async () => {
    const inputError = 'Invalid input';

    const schema1 = formDataAsync(
      { a: optionalAsync(stringAsync()), b: optionalAsync(stringAsync()) },
      [custom((input) => Object.keys(input).length === 1)]
    );
    const input1 = new FormData();
    input1.append('a', 'x');
    const input2 = new FormData();
    const input3 = new FormData();
    input3.append('a', 'x');
    input3.append('b', 'y');
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual({ a: 'x' });
    expect(parseAsync(schema1, input2)).rejects.toThrowError(inputError);
    expect(parseAsync(schema1, input3)).rejects.toThrowError(inputError);

    const schema2 = formDataAsync(
      { a: optionalAsync(stringAsync()), b: optionalAsync(stringAsync()) },
      'Error',
      [custom((input) => Object.keys(input).length === 1)]
    );
    const output2 = await parseAsync(schema2, input1);
    expect(output2).toEqual({ a: 'x' });
    expect(parseAsync(schema2, input2)).rejects.toThrowError(inputError);
    expect(parseAsync(schema2, input3)).rejects.toThrowError(inputError);
  });

  test('should execute pipe if output is typed', async () => {
    const requirement1 = (input: { a: string }) =>
      Object.keys(input).length > 10;
    const schema1 = formDataAsync({ a: stringAsync([minLength(10)]) }, [
      custom(requirement1),
    ]);
    const input1 = new FormData();
    input1.append('a', '12345');
    const result1 = await schema1._parse(input1);
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
    const schema2 = formDataAsync(
      { a: arrayAsync(stringAsync([minLength(10)])) },
      [custom(requirement2)]
    );
    const input2 = new FormData();
    input2.append('a', '123');
    input2.append('a', '12345');
    input2.append('a', '1234567890=');
    const result2 = await schema2._parse(input2);
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

  test('should skip pipe if output is not typed', async () => {
    const schema1 = formDataAsync({ a: numberAsync() }, [
      custom((input) => Object.keys(input).length > 10),
    ]);
    const input1 = new FormData();
    input1.append('a', '$12345');
    const result1 = await schema1._parse(input1);
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

    const schema2 = formDataAsync({ a: arrayAsync(numberAsync()) }, [
      custom((input) => Object.keys(input).length > 10),
    ]);
    const input2 = new FormData();
    input2.append('a', '123');
    input2.append('a', '$12345');
    input2.append('a', '$1234567890=');
    const result2 = await schema2._parse(input2);
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

  test('should output object', async () => {
    const schema = formDataAsync({ a: optionalAsync(stringAsync()) });
    const input = new FormData();
    const result = await schema._parse(input);
    expect(result.output).toEqual({});
    expect(parseAsync(schema, input)).resolves.toEqual({});
  });

  test('should accept object schema', async () => {
    const schema = formDataAsync(
      objectAsync({ a: objectAsync({ b: numberAsync() }) })
    );
    const input = new FormData();
    input.append('a.b', '123');
    const result = await schema._parse(input);
    expect(result.output).toEqual({ a: { b: 123 } });
  });

  test('should decode array', async () => {
    const schema1 = formDataAsync({
      a: arrayAsync(numberAsync()),
      b: arrayAsync(numberAsync()),
      c: arrayAsync(arrayAsync(numberAsync())),
      d: arrayAsync(objectAsync({ x: arrayAsync(numberAsync()) })),
      e: arrayAsync(objectAsync({ x: arrayAsync(numberAsync()) })),
      f: nullableAsync(arrayAsync(numberAsync())),
      g: optionalAsync(arrayAsync(numberAsync())),
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
    const result1 = await schema1._parse(input1);
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

  test('should require array', async () => {
    const schema = formDataAsync({
      a: stringAsync(),
      b: arrayAsync(optionalAsync(stringAsync()), 'array is required'),
      c: optionalAsync(arrayAsync(stringAsync(), 'array is optional')),
    });
    const input = new FormData();
    input.append('a', 'x');
    expect(parseAsync(schema, input)).rejects.toThrowError('array is required');
  });

  test('should decode boolean', async () => {
    const schema1 = formDataAsync({
      a: booleanAsync(),
      b: booleanAsync(),
      c: nullableAsync(booleanAsync()),
      d: optionalAsync(booleanAsync()),
    });
    const input1 = new FormData();
    input1.append('a', 'true');
    input1.append('b', 'false');
    input1.append('c', '');
    const result1 = await schema1._parse(input1);
    expect(result1.output).toEqual({ a: true, b: false, c: null });

    const schema2 = formDataAsync({ a: booleanAsync() });
    const input2 = new FormData();
    input2.append('a', 'x');
    expect(parseAsync(schema2, input2)).rejects.toThrowError(
      'Invalid type: Expected boolean but received "x"'
    );
  });

  test('should decode date', async () => {
    const schema1 = formDataAsync({
      a: dateAsync(),
      b: dateAsync(),
      c: nullableAsync(dateAsync()),
      d: optionalAsync(dateAsync()),
    });
    const input1 = new FormData();
    input1.append('a', '2021-01-01T00:00:00Z');
    input1.append('b', '1609459200000');
    input1.append('c', '');
    const result1 = await schema1._parse(input1);
    expect(result1.output).toEqual({
      a: new Date('2021-01-01T00:00:00Z'),
      b: new Date('2021-01-01T00:00:00Z'),
      c: null,
    });

    const schema2 = formDataAsync({ a: dateAsync() });
    const input2 = new FormData();
    input2.append('a', 'x');
    expect(parseAsync(schema2, input2)).rejects.toThrowError(
      'Invalid type: Expected Date but received "x"'
    );
  });

  test('should decode file', async () => {
    const value = new File(['foo'], 'bar.txt', { type: 'text/plain' });
    const schema1 = formDataAsync({ a: instanceAsync(File) });
    const input1 = new FormData();
    input1.append('a', new Blob(['123']));
    const result1 = await schema1._parse(input1);
    expect(result1.output).toEqual({ a: value });

    const schema2 = formDataAsync({ a: instanceAsync(File) });
    const input2 = new FormData();
    input2.append('a', 'x');
    expect(parseAsync(schema2, input2)).rejects.toThrowError(
      'Invalid type: Expected File but received "x"'
    );
  });

  test('should decode number', async () => {
    const schema1 = formDataAsync({
      a: numberAsync(),
      b: numberAsync(),
      c: nullableAsync(numberAsync()),
      d: optionalAsync(numberAsync()),
    });
    const input1 = new FormData();
    input1.append('a', '123');
    input1.append('b', '-4.56');
    input1.append('c', '');
    const result1 = await schema1._parse(input1);
    expect(result1.output).toEqual({ a: 123, b: -4.56, c: null });

    const schema2 = formDataAsync({ a: numberAsync() });
    const input2 = new FormData();
    input2.append('a', 'x');
    expect(parseAsync(schema2, input2)).rejects.toThrowError(
      'Invalid type: Expected number but received "x"'
    );

    const schema3 = formDataAsync({ a: numberAsync() });
    const input3 = new FormData();
    input3.append('a', 'NaN');
    expect(parseAsync(schema3, input3)).rejects.toThrowError(
      'Invalid type: Expected number but received "NaN"'
    );
  });

  test('should decode object', async () => {
    const schema1 = formDataAsync({
      a: objectAsync({ a: stringAsync() }),
      b: objectAsync({ b: objectAsync({ b: stringAsync() }) }),
      c: nullableAsync(objectAsync({ c: stringAsync() })),
      d: optionalAsync(objectAsync({ d: stringAsync() })),
    });
    const input1 = new FormData();
    input1.append('a.a', 'x');
    input1.append('b.b.b', 'x');
    input1.append('c', '');
    const result1 = await schema1._parse(input1);
    expect(result1.output).toEqual({
      a: { a: 'x' },
      b: { b: { b: 'x' } },
      c: null,
    });

    const schema2 = formDataAsync({ a: objectAsync({ b: stringAsync() }) });
    const input2 = new FormData();
    input2.append('a', 'x');
    expect(parseAsync(schema2, input2)).rejects.toThrowError(
      'Invalid type: Expected Object but received undefined'
    );
  });

  test('should require object', async () => {
    const schema = formDataAsync({
      a: stringAsync(),
      b: objectAsync(
        { foo: optionalAsync(stringAsync()) },
        'object is required'
      ),
      c: optionalAsync(
        objectAsync({ bar: stringAsync() }, 'object is optional')
      ),
    });
    const input = new FormData();
    input.append('a', 'x');
    expect(parseAsync(schema, input)).rejects.toThrowError(
      'object is required'
    );
  });

  test('should decode string', async () => {
    const schema1 = formDataAsync({
      a: stringAsync(),
      b: stringAsync(),
      c: stringAsync(),
      d: stringAsync(),
      e: stringAsync(),
      f: stringAsync(),
      g: nullableAsync(stringAsync()),
      h: optionalAsync(stringAsync()),
    });
    const input1 = new FormData();
    input1.append('a', 'x');
    input1.append('b', '0');
    input1.append('c', 'NaN');
    input1.append('d', 'false');
    input1.append('e', 'null');
    input1.append('f', 'undefined');
    input1.append('g', '');
    const result1 = await schema1._parse(input1);
    expect(result1.output).toEqual({
      a: 'x',
      b: '0',
      c: 'NaN',
      d: 'false',
      e: 'null',
      f: 'undefined',
      g: null,
    });

    const schema2 = formDataAsync({ a: stringAsync() });
    const input2 = new FormData();
    input2.append('a', new File(['foo'], 'bar.txt', { type: 'text/plain' }));
    expect(parseAsync(schema2, input2)).rejects.toThrowError(
      'Invalid type: Expected string but received File'
    );
  });
});
