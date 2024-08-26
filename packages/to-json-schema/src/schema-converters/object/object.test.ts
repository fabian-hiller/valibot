import * as v from 'valibot';
import type { ObjectEntries } from 'valibot';
import { describe, expect, test } from 'vitest';
import { convertSchema } from '../convertSchema.ts';
import { object } from './object.ts';

describe('object', () => {
  test('should convert schema without entries', () => {
    const converted = object(v.object({}), convertSchema);
    expect(converted).toEqual({
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false,
    });
  });

  test('should convert schema with entries', () => {
    const converted = object(
      v.object({ aProp: v.string() } as ObjectEntries),
      convertSchema
    );
    expect(converted).toEqual({
      type: 'object',
      properties: { aProp: { type: 'string' } },
      required: ['aProp'],
      additionalProperties: false,
    });
  });
});
