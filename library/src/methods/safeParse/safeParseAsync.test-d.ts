import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/pipe.ts';
import { safeParseAsync } from './safeParseAsync.ts';
import type { SafeParseResult } from './types.ts';

describe('safeParseAsync', () => {
  test('should return safe parse result', () => {
    const schema = object({
      key: pipe(
        string(),
        transform((input) => input.length)
      ),
    });
    expectTypeOf(safeParseAsync(schema, { key: 'foo' })).toEqualTypeOf<
      Promise<SafeParseResult<typeof schema>>
    >();
  });
});
