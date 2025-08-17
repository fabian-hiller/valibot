import { describe, expectTypeOf, test } from 'vitest';
import {
  boolean,
  type BooleanIssue,
  nullish,
  number,
  type NumberIssue,
  object,
  type ObjectIssue,
  objectWithRest,
  type ObjectWithRestIssue,
  optional,
  string,
  type StringIssue,
} from '../../schemas/index.ts';
import type { BaseHKTable, HKTImplementation } from '../../types/hkt.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  partialBy,
  type PartialByModifierHKT,
  type SchemaWithPartialBy,
} from './partialBy.ts';

type ModifierImpl = HKTImplementation<BaseHKTable<PartialByModifierHKT>>;

describe('partialBy', () => {
  const entries = {
    key1: string(),
    key2: number(),
    key3: string(),
    key4: nullish(number(), () => 123),
  };

  describe('object', () => {
    const wrapped = object(entries);
    type Wrapped = typeof wrapped;
    type Schema1<TModifier extends ModifierImpl> = SchemaWithPartialBy<
      Wrapped,
      ReturnType<TModifier>,
      undefined
    >;
    type Schema2<TModifier extends ModifierImpl> = SchemaWithPartialBy<
      Wrapped,
      ReturnType<TModifier>,
      ['key1', 'key3']
    >;

    describe('should return schema object', () => {
      test('with modified keys', () => {
        expectTypeOf(partialBy(wrapped, optional)).toEqualTypeOf<
          Schema1<typeof optional>
        >();
        expectTypeOf(partialBy(wrapped, nullish)).toEqualTypeOf<
          Schema1<typeof nullish>
        >();
      });
      test('with specific keys', () => {
        expectTypeOf(
          partialBy(wrapped, optional, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof optional>>();
        expectTypeOf(
          partialBy(wrapped, nullish, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nullish>>();
      });

      describe('should infer correct types', () => {
        test('of input', () => {
          expectTypeOf<InferInput<Schema1<typeof optional>>>().toEqualTypeOf<{
            key1?: string;
            key2?: number;
            key3?: string;
            key4?: number | null;
          }>();
          expectTypeOf<InferInput<Schema1<typeof nullish>>>().toEqualTypeOf<{
            key1?: string | null | undefined;
            key2?: number | null | undefined;
            key3?: string | null | undefined;
            key4?: number | null | undefined;
          }>();
          expectTypeOf<InferInput<Schema2<typeof optional>>>().toEqualTypeOf<{
            key1?: string;
            key2: number;
            key3?: string;
            key4?: number | null;
          }>();
          expectTypeOf<InferInput<Schema2<typeof nullish>>>().toEqualTypeOf<{
            key1?: string | null | undefined;
            key2: number;
            key3?: string | null | undefined;
            key4?: number | null;
          }>();
        });

        test('of output', () => {
          expectTypeOf<InferOutput<Schema1<typeof optional>>>().toEqualTypeOf<{
            key1?: string;
            key2?: number;
            key3?: string;
            key4?: number;
          }>();
          expectTypeOf<InferOutput<Schema1<typeof nullish>>>().toEqualTypeOf<{
            key1?: string | null;
            key2?: number | null;
            key3?: string | null;
            key4?: number | null;
          }>();
          expectTypeOf<InferOutput<Schema2<typeof optional>>>().toEqualTypeOf<{
            key1?: string;
            key2: number;
            key3?: string;
            key4: number;
          }>();
          expectTypeOf<InferOutput<Schema2<typeof nullish>>>().toEqualTypeOf<{
            key1?: string | null;
            key2: number;
            key3?: string | null;
            key4: number;
          }>();
        });

        test('of issue', () => {
          expectTypeOf<InferIssue<Schema1<typeof optional>>>().toEqualTypeOf<
            ObjectIssue | StringIssue | NumberIssue
          >();
          expectTypeOf<InferIssue<Schema1<typeof nullish>>>().toEqualTypeOf<
            ObjectIssue | StringIssue | NumberIssue
          >();
          expectTypeOf<InferIssue<Schema2<typeof optional>>>().toEqualTypeOf<
            ObjectIssue | StringIssue | NumberIssue
          >();
          expectTypeOf<InferIssue<Schema2<typeof nullish>>>().toEqualTypeOf<
            ObjectIssue | StringIssue | NumberIssue
          >();
        });
      });
    });
  });
  describe('objectWithRest', () => {
    const wrapped = objectWithRest(entries, boolean());
    type Wrapped = typeof wrapped;
    type Schema1<TModifier extends ModifierImpl> = SchemaWithPartialBy<
      Wrapped,
      ReturnType<TModifier>,
      undefined
    >;
    type Schema2<TModifier extends ModifierImpl> = SchemaWithPartialBy<
      Wrapped,
      ReturnType<TModifier>,
      ['key1', 'key3']
    >;

    describe('should return schema object', () => {
      test('with modified keys', () => {
        expectTypeOf(partialBy(wrapped, optional)).toEqualTypeOf<
          Schema1<typeof optional>
        >();
        expectTypeOf(partialBy(wrapped, nullish)).toEqualTypeOf<
          Schema1<typeof nullish>
        >();
      });
      test('with specific keys', () => {
        expectTypeOf(
          partialBy(wrapped, optional, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof optional>>();
        expectTypeOf(
          partialBy(wrapped, nullish, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nullish>>();
      });

      describe('should infer correct types', () => {
        test('of input', () => {
          expectTypeOf<InferInput<Schema1<typeof optional>>>().toEqualTypeOf<
            {
              key1?: string;
              key2?: number;
              key3?: string;
              key4?: number | null;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<InferInput<Schema1<typeof nullish>>>().toEqualTypeOf<
            {
              key1?: string | null | undefined;
              key2?: number | null | undefined;
              key3?: string | null | undefined;
              key4?: number | null | undefined;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<InferInput<Schema2<typeof optional>>>().toEqualTypeOf<
            {
              key1?: string;
              key2: number;
              key3?: string;
              key4?: number | null;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<InferInput<Schema2<typeof nullish>>>().toEqualTypeOf<
            {
              key1?: string | null | undefined;
              key2: number;
              key3?: string | null | undefined;
              key4?: number | null | undefined;
            } & {
              [key: string]: boolean;
            }
          >();
        });

        test('of output', () => {
          expectTypeOf<InferOutput<Schema1<typeof optional>>>().toEqualTypeOf<
            {
              key1?: string;
              key2?: number;
              key3?: string;
              key4?: number;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<InferOutput<Schema1<typeof nullish>>>().toEqualTypeOf<
            {
              key1?: string | null;
              key2?: number | null;
              key3?: string | null;
              key4?: number | null;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<InferOutput<Schema2<typeof optional>>>().toEqualTypeOf<
            {
              key1?: string;
              key2: number;
              key3?: string;
              key4: number;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<InferOutput<Schema2<typeof nullish>>>().toEqualTypeOf<
            {
              key1?: string | null;
              key2: number;
              key3?: string | null;
              key4: number;
            } & {
              [key: string]: boolean;
            }
          >();
        });

        test('of issue', () => {
          expectTypeOf<InferIssue<Schema1<typeof optional>>>().toEqualTypeOf<
            ObjectWithRestIssue | StringIssue | NumberIssue | BooleanIssue
          >();
          expectTypeOf<InferIssue<Schema1<typeof nullish>>>().toEqualTypeOf<
            ObjectWithRestIssue | StringIssue | NumberIssue | BooleanIssue
          >();
          expectTypeOf<InferIssue<Schema2<typeof optional>>>().toEqualTypeOf<
            ObjectWithRestIssue | StringIssue | NumberIssue | BooleanIssue
          >();
          expectTypeOf<InferIssue<Schema2<typeof nullish>>>().toEqualTypeOf<
            ObjectWithRestIssue | StringIssue | NumberIssue | BooleanIssue
          >();
        });
      });
    });
  });
});
