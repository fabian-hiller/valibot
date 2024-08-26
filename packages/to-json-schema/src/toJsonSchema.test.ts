import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { toJsonSchema } from './toJsonSchema.ts';

describe('toJsonSchema', () => {
  test('should convert schema', () => {
    expect(toJsonSchema(v.string())).toEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'string',
    });
  });
});
