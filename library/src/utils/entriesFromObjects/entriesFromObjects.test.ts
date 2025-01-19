import { describe, expect, test } from 'vitest';
import { number, object, optional, string } from '../../schemas/index.ts';
import { entriesFromObjects } from './entriesFromObjects.ts';

describe('entriesFromObjects', () => {
  describe('should return objects entries', () => {
    const fooSchema = object({ foo: string() });
    const barSchema = object({ bar: string() });
    const overrideSchema = object({ foo: optional(number()) });

    test('for empty schema', () => {
      expect(entriesFromObjects(object({}))).toStrictEqual({});
    });

    test('for single schema', () => {
      expect(entriesFromObjects(fooSchema)).toStrictEqual(fooSchema.entries);
    });

    test('for multi schema', () => {
      expect(entriesFromObjects(fooSchema, barSchema)).toStrictEqual({
        ...fooSchema.entries,
        ...barSchema.entries,
      });
    });

    test('for override schema', () => {
      expect(
        entriesFromObjects(fooSchema, barSchema, overrideSchema)
      ).toStrictEqual({
        ...fooSchema.entries,
        ...barSchema.entries,
        ...overrideSchema.entries,
      });
    });
  });
});
