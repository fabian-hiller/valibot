import { describe, expectTypeOf, test } from 'vitest';
import {
  boolean,
  type BooleanIssue,
  type BooleanSchema,
  number,
  type NumberIssue,
  type NumberSchema,
  object,
  type ObjectIssue,
  type ObjectSchema,
  objectWithRest,
  type ObjectWithRestIssue,
  type ObjectWithRestSchema,
  string,
  type StringIssue,
  type StringSchema,
} from '../../schemas/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { pick, type SchemaWithPick } from './pick.ts';

describe('pick', () => {
  describe('object', () => {
    test('should return schema object', () => {
      expectTypeOf(
        pick(object({ key1: string(), key2: number() }), ['key1'])
      ).toEqualTypeOf<
        SchemaWithPick<
          ObjectSchema<
            {
              readonly key1: StringSchema<undefined>;
              readonly key2: NumberSchema<undefined>;
            },
            undefined
          >,
          ['key1']
        >
      >();
    });

    describe('should infer correct types', () => {
      type Schema = SchemaWithPick<
        ObjectSchema<
          {
            readonly key1: StringSchema<undefined>;
            readonly key2: NumberSchema<undefined>;
          },
          undefined
        >,
        ['key1']
      >;

      test('of input', () => {
        expectTypeOf<InferInput<Schema>>().toEqualTypeOf<{
          key1: string;
        }>();
      });

      test('of output', () => {
        expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<{
          key1: string;
        }>();
      });

      test('of issue', () => {
        expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
          ObjectIssue | StringIssue
        >();
      });
    });
  });

  describe('objectWithRest', () => {
    test('should return schema object', () => {
      expectTypeOf(
        pick(objectWithRest({ key1: string(), key2: number() }, boolean()), [
          'key2',
        ])
      ).toEqualTypeOf<
        SchemaWithPick<
          ObjectWithRestSchema<
            {
              readonly key1: StringSchema<undefined>;
              readonly key2: NumberSchema<undefined>;
            },
            BooleanSchema<undefined>,
            undefined
          >,
          ['key2']
        >
      >();
    });

    describe('should infer correct types', () => {
      type Schema = SchemaWithPick<
        ObjectWithRestSchema<
          {
            readonly key1: StringSchema<undefined>;
            readonly key2: NumberSchema<undefined>;
          },
          BooleanSchema<undefined>,
          undefined
        >,
        ['key2']
      >;

      test('of input', () => {
        expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
          { key2: number } & { [key: string]: boolean }
        >();
      });

      test('of output', () => {
        expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
          { key2: number } & { [key: string]: boolean }
        >();
      });

      test('of issue', () => {
        expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
          ObjectWithRestIssue | NumberIssue | BooleanIssue
        >();
      });
    });
  });
});
