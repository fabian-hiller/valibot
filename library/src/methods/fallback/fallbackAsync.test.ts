import { describe, test, expect, expectTypeOf  } from 'vitest';
import { objectAsync, stringAsync, numberAsync } from '../../schemas/index.ts';
import { minLength } from '../../validations/index.ts';
import { parseAsync, safeParseAsync } from '../../index.ts';
import { fallbackAsync } from './fallbackAsync.ts';

describe('fallbackAsync', () => {
  test('should parseAsync normally', async () => {
    const schema = fallbackAsync(stringAsync(), 'world');
    const output = await parseAsync(schema, 'hello');
    expect(output).toBe('hello');
    expectTypeOf(output).toEqualTypeOf<string>()
  });

  test('should succeed to parseAsync but return fallback value', async () => {
    const schema = fallbackAsync(stringAsync([minLength(6)]), 'hello world');
    const output = await parseAsync(schema, 'hello');
    expect(output).toEqual('hello world');
  });

  test('should succeed, return fallback and issues need to match non-fallback ones', async () => {
    const objectSchema = objectAsync({
      text: stringAsync([minLength(6)]),
      data: numberAsync(),
    });

    let issues: any
    const fallbackValue = { text: 'hello world', data: 5 }
    const schema = fallbackAsync(objectSchema, fallbackValue, (dataIssues) => { issues = dataIssues });

    const data = { text: 'hello' }
    const output = await parseAsync(schema, data);
    expectTypeOf(output).toEqualTypeOf<{ text: string, data: number }>()
    expect(output).toEqual(fallbackValue);

    expect(issues).lengthOf.above(0);
    //expect(issues).toEqual([  ]);

    const result = await safeParseAsync(objectSchema, data)
    expect(result.success).toBeFalsy()
    expect((result as any).issues).toEqual(issues)
  });

  test('nested fallback', async () => {
    let issues: any
    const fallbackValue = { text: 'hello world', data: 5 }
    const schema = fallbackAsync(objectAsync({
      text: fallbackAsync(stringAsync([minLength(6)]), fallbackValue.text, (dataIssues) => { issues = dataIssues }),
      data: numberAsync(),
    }), fallbackValue,(dataIssues) => { issues = dataIssues });

    {
      const data = { data: 2 }
      const output = parseAsync(schema, data);
      expect(output).toEqual({ ...data, text: fallbackValue.text });

      expect(issues).lengthOf.above(0);
      expect(issues).toHaveLength(1);
      //expect(issues).toEqual([  ]);
    }

    issues = []
    {
      const output = parseAsync(schema, {});
      expect(output).toEqual(fallbackValue);

      expect(issues).lengthOf.above(0);
      expect(issues).toHaveLength(1);
    }
  });
});
