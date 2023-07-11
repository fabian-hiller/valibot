import { describe, expect, test } from 'vitest';
import { parseAsync } from '../methods';
import { tupleAsync } from './tupleAsync';
import { string } from './string';
import { number } from './number';
import { maxLength, minLength } from '../validations';
import { numberAsync } from './numberAsync';
import { booleanAsync } from './booleanAsync';

describe('tupleAsync', () => {
  test('should pass only tuples', async () => {
    const schema1 = tupleAsync([numberAsync(), string()]);
    const input1 = [1, 'test'];
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toEqual(input1);
    await expect(parseAsync(schema1, [])).rejects.toThrowError();
    await expect(parseAsync(schema1, [1])).rejects.toThrowError();
    await expect(parseAsync(schema1, [1, 2])).rejects.toThrowError();
    await expect(parseAsync(schema1, [1, 'test', null])).rejects.toThrowError();
    await expect(parseAsync(schema1, 123)).rejects.toThrowError();
    await expect(parseAsync(schema1, null)).rejects.toThrowError();
    await expect(parseAsync(schema1, {})).rejects.toThrowError();

    const schema2 = tupleAsync([string()], number());
    const input2 = ['test'];
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toEqual(input2);
    const input3 = ['test', 1];
    const output3 = await parseAsync(schema2, input3);
    expect(output3).toEqual(input3);
    const input4 = ['test', 1, 2];
    const output4 = await parseAsync(schema2, input4);
    expect(output4).toEqual(input4);
    await expect(parseAsync(schema2, ['test', 'test'])).rejects.toThrowError();
    await expect(parseAsync(schema2, [1, 2])).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a tuple!';
    await expect(
      parseAsync(tupleAsync([number()], error), null)
    ).rejects.toThrowError(error);
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
});
