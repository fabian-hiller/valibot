import { describe, expect, test } from 'vitest';
import { dateAsync, numberAsync, stringAsync } from '../../schemas/index.ts';
import { parseAsync } from '../parse/index.ts';
import { coerceAsync } from './coerceAsync.ts';

describe('coerceAsync', () => {
  test('should coerce number to string', async () => {
    const output = await parseAsync(coerceAsync(stringAsync(), String), 5);
    expect(output).toBe('5');
  });

  test('should coerce string to number', async () => {
    const output = await parseAsync(coerceAsync(numberAsync(), Number), '5');
    expect(output).toBe(5);
  });

  test('should coerce number to date', async () => {
    const time = 1688902224413;
    const output = await parseAsync(
      coerceAsync(dateAsync(), (input) => new Date(input as any)),
      time
    );
    expect(output).toBeInstanceOf(Date);
    expect(output.getTime()).toBe(time);
  });
});
