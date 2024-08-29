import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { toJsonSchema } from './toJsonSchema.ts';

describe('toJsonSchema', () => {
  test('should convert to JSON schema', () => {
    expect(
      toJsonSchema(
        v.pipe(
          v.object({
            name: v.string(),
            email: v.pipe(v.string(), v.email()),
            age: v.optional(v.number()),
          }),
          v.description('foo')
        )
      )
    ).toStrictEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        age: { type: 'number' },
      },
      required: ['name', 'email'],
      additionalProperties: false,
      description: 'foo',
    });
  });
});
