import { describe, expect, expectTypeOf, test } from 'vitest';
import { object, string } from '../../schemas/index.ts';
import { parse } from '../parse/index.ts';
import type { Output } from '../../types.ts';
import { brand, type BRAND } from './brand.ts';

describe('brand', () => {
  describe('Parsing behavior', () => {
    test('brand does not affect parse', () => {
      const testSchema = brand(object({ key: string() }), 'testLabel');
      const testInput = { key: 'testValue' };
      const testOutput = parse(testSchema, testInput);
      expect(testOutput).toEqual(testInput);
    });
  });

  describe('Type behavior', () => {
    test('Output type is branded', () => {
      const testSchema = brand(object({ attribute: string() }), 'testLabel');
      type SchemaType = Output<typeof testSchema>;

      expectTypeOf<SchemaType>().toEqualTypeOf<
        { attribute: string } & BRAND<'testLabel'>
      >();
    });

    test('branded type is distinct from original type', () => {
      const originalType = string();
      const brandedType = brand(string(), 'testLabel');

      expectTypeOf(brandedType).not.toEqualTypeOf(originalType);
    });

    test('Different brands are distinct', () => {
      const firstSchema = brand(string(), 'firstLabel');
      type FirstSchemaType = Output<typeof firstSchema>;

      const secondSchema = brand(string(), 'secondLabel');
      type SecondSchemaType = Output<typeof secondSchema>;

      expectTypeOf<FirstSchemaType>().not.toEqualTypeOf<SecondSchemaType>();
    });

    test('Multiple brands can be applied', () => {
      const firstBranding = brand(string(), 'firstLabel');
      const secondBranding = brand(firstBranding, 'secondLabel');
      type CombinedSchemaType = Output<typeof secondBranding>;

      expectTypeOf<CombinedSchemaType>().toEqualTypeOf<
        string & BRAND<'firstLabel'> & BRAND<'secondLabel'>
      >();
    });
  });
});
