import { describe, expectTypeOf, test } from 'vitest';
import { number, object, optional, string } from '../../schemas/index.ts';
import { entriesFromObjects } from './entriesFromObjects.ts';

describe('entriesFromObjects', () => {
  describe('should return objects entries', () => {
    const fooSchema = object({ foo: string() });
    const barSchema = object({ bar: string() });
    const overrideSchema = object({ foo: optional(number()) });

    test('for single schema', () => {
      expectTypeOf(object(entriesFromObjects(fooSchema))).toEqualTypeOf<
        typeof fooSchema
      >()
    });

    test('for multi schema', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const foobar = object({
        ...fooSchema.entries,
        ...barSchema.entries
      })

      expectTypeOf(object(entriesFromObjects(fooSchema, barSchema))).toEqualTypeOf<
        typeof foobar
      >();
    });

    test('for override schema', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const foobarOverride = object({
        ...fooSchema.entries,
        ...barSchema.entries,
        ...overrideSchema.entries
      })

      expectTypeOf(object(entriesFromObjects(fooSchema, barSchema, overrideSchema))).toEqualTypeOf<
        typeof foobarOverride
      >();
    });
  });
});
