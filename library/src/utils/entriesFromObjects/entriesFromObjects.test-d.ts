/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expectTypeOf, test } from 'vitest';
import {
  number,
  object,
  objectAsync,
  optional,
  string,
} from '../../schemas/index.ts';
import { entriesFromObjects } from './entriesFromObjects.ts';

describe('entriesFromObjects', () => {
  describe('should return objects entries', () => {
    const fooSchema = object({ foo: string() });
    const barSchema = object({ bar: string() });
    const overrideSchema = object({ foo: optional(number()) });

    test('for empty schema', () => {
      const r1 = {};
      expectTypeOf(entriesFromObjects()).toEqualTypeOf<typeof r1>();

      const r2 = object(entriesFromObjects(object({})));
      expectTypeOf(object({})).toEqualTypeOf<typeof r2>();
    });

    test('for single schema', () => {
      const o = object(entriesFromObjects(fooSchema));
      expectTypeOf(o).toEqualTypeOf<typeof fooSchema>();
    });

    test('for multi schema', () => {
      const foobar = object({
        ...fooSchema.entries,
        ...barSchema.entries,
      });

      const o = object(entriesFromObjects(fooSchema, barSchema));
      expectTypeOf(o).toEqualTypeOf<typeof foobar>();
    });

    test('for override schema', () => {
      const foobarOverride = object({
        ...fooSchema.entries,
        ...barSchema.entries,
        ...overrideSchema.entries,
      });

      const o = object(
        entriesFromObjects(fooSchema, barSchema, overrideSchema)
      );
      expectTypeOf(o).toEqualTypeOf<typeof foobarOverride>();
    });

    test('for async object schema', () => {
      const asyncFooSchema = objectAsync(entriesFromObjects(fooSchema));

      const o = objectAsync(entriesFromObjects(asyncFooSchema));
      expectTypeOf(o).toEqualTypeOf<typeof asyncFooSchema>();

      const o2 = object(entriesFromObjects(asyncFooSchema));
      expectTypeOf(o2).toEqualTypeOf<typeof fooSchema>();
    });
  });
});
