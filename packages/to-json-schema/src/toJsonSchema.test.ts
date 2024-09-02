import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { toJsonSchema } from './toJsonSchema.ts';

describe('toJsonSchema', () => {
  test('should convert to JSON schema', () => {
    const aString = v.string();
    const complexSchema = v.pipe(
      v.object({
        name: v.lazy(() => aString),
        email: v.pipe(aString, v.email(), v.minLength(10)),
        age: v.optional(v.number()),
      }),
      v.description('foo')
    );
    expect(
      toJsonSchema(complexSchema, { definitions: { aString, complexSchema } })
    ).toStrictEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $ref: '#/$defs/complexSchema',
      $defs: {
        aString: { type: 'string' },
        complexSchema: {
          type: 'object',
          properties: {
            name: { $ref: '#/$defs/aString' },
            email: { type: 'string', format: 'email', minLength: 10 },
            age: { type: 'number' },
          },
          required: ['name', 'email'],
          additionalProperties: false,
          description: 'foo',
        },
      },
    });
  });
});
