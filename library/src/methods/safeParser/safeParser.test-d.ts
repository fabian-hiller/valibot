import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/pipe.ts';
import type { SafeParseResult } from '../safeParse/index.ts';
import { safeParser } from './safeParser.ts';

describe('safeParser', () => {
  test('should return safe parse result', () => {
    const schema = object({
      key: pipe(
        string(),
        transform((input) => input.length)
      ),
    });
    expectTypeOf(safeParser(schema)({ key: 'foo' })).toEqualTypeOf<
      SafeParseResult<typeof schema>
    >();
  });
});
