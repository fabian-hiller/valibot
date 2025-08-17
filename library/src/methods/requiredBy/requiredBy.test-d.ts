import { describe, expectTypeOf, test } from 'vitest';
import {
  nonNullish,
  type NonNullishIssue,
  nonOptional,
  type NonOptionalIssue,
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
import type {
  BaseHKTable,
  HKTImplementation,
  InferInput,
  InferIssue,
  InferOutput,
} from '../../types/index.ts';
import {
  requiredBy,
  type RequiredByModifierHKT,
  type SchemaWithRequiredBy,
} from './requiredBy.ts';

type ModifierImpl = HKTImplementation<BaseHKTable<RequiredByModifierHKT>>;

describe('requiredBy', () => {
  const entries = {
    key1: optional(string()),
    key2: optional(number()),
    key3: nullish(string()),
    key4: nullish(number(), () => 123),
  };

  describe('object', () => {
    const wrapped = object(entries);
    type Wrapped = typeof wrapped;
    type Schema1<TModifier extends ModifierImpl> = SchemaWithRequiredBy<
      Wrapped,
      ReturnType<TModifier>,
      undefined,
      undefined
    >;
    type Schema2<TModifier extends ModifierImpl> = SchemaWithRequiredBy<
      Wrapped,
      ReturnType<TModifier>,
      ['key1', 'key3'],
      undefined
    >;

    describe('should require modifier to support correct HKT', () => {
      test('with modified keys', () => {
        // @ts-expect-error
        requiredBy(wrapped, optional);
      });
      test('with specific keys', () => {
        // @ts-expect-error
        requiredBy(wrapped, optional, ['key1', 'key3']);
      });
    });

    describe('should return correct schema', () => {
      test('with modified keys', () => {
        expectTypeOf(requiredBy(wrapped, nonOptional)).toEqualTypeOf<
          Schema1<typeof nonOptional>
        >();
        expectTypeOf(requiredBy(wrapped, nonNullish)).toEqualTypeOf<
          Schema1<typeof nonNullish>
        >();
      });
      test('with specific keys', () => {
        expectTypeOf(
          requiredBy(wrapped, nonOptional, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nonOptional>>();
        expectTypeOf(
          requiredBy(wrapped, nonNullish, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nonNullish>>();
      });
    });

    describe('should infer correct types', () => {
      test('of input', () => {
        expectTypeOf<InferInput<Schema1<typeof nonOptional>>>().toEqualTypeOf<{
          key1: string;
          key2: number;
          key3: string | null;
          key4: number | null;
        }>();
        expectTypeOf<InferInput<Schema1<typeof nonNullish>>>().toEqualTypeOf<{
          key1: string;
          key2: number;
          key3: string;
          key4: number;
        }>();
        expectTypeOf<InferInput<Schema2<typeof nonOptional>>>().toEqualTypeOf<{
          key1: string;
          key2?: number;
          key3: string | null;
          key4?: number | null;
        }>();
        expectTypeOf<InferInput<Schema2<typeof nonNullish>>>().toEqualTypeOf<{
          key1: string;
          key2?: number;
          key3: string;
          key4?: number | null;
        }>();
      });
      test('of output', () => {
        expectTypeOf<InferOutput<Schema1<typeof nonOptional>>>().toEqualTypeOf<{
          key1: string;
          key2: number;
          key3: string | null;
          key4: number;
        }>();
        expectTypeOf<InferOutput<Schema1<typeof nonNullish>>>().toEqualTypeOf<{
          key1: string;
          key2: number;
          key3: string;
          key4: number;
        }>();
        expectTypeOf<InferOutput<Schema2<typeof nonOptional>>>().toEqualTypeOf<{
          key1: string;
          key2?: number;
          key3: string | null;
          key4: number;
        }>();
        expectTypeOf<InferOutput<Schema2<typeof nonNullish>>>().toEqualTypeOf<{
          key1: string;
          key2?: number;
          key3: string;
          key4: number;
        }>();
      });
      test('of issue', () => {
        expectTypeOf<InferIssue<Schema1<typeof nonOptional>>>().toEqualTypeOf<
          NonOptionalIssue | ObjectIssue | StringIssue | NumberIssue
        >();
        expectTypeOf<InferIssue<Schema1<typeof nonNullish>>>().toEqualTypeOf<
          NonNullishIssue | ObjectIssue | StringIssue | NumberIssue
        >();
        expectTypeOf<InferIssue<Schema2<typeof nonOptional>>>().toEqualTypeOf<
          NonOptionalIssue | ObjectIssue | StringIssue | NumberIssue
        >();
        expectTypeOf<InferIssue<Schema2<typeof nonNullish>>>().toEqualTypeOf<
          NonNullishIssue | ObjectIssue | StringIssue | NumberIssue
        >();
      });
    });
  });
  describe('objectWithRest', () => {
    const rest = string();
    const wrapped = objectWithRest(entries, rest);
    type Wrapped = typeof wrapped;
    type Schema1<TModifier extends ModifierImpl> = SchemaWithRequiredBy<
      Wrapped,
      ReturnType<TModifier>,
      undefined,
      undefined
    >;
    type Schema2<TModifier extends ModifierImpl> = SchemaWithRequiredBy<
      Wrapped,
      ReturnType<TModifier>,
      ['key1', 'key3'],
      undefined
    >;

    describe('should require modifier to support correct HKT', () => {
      test('with modified keys', () => {
        // @ts-expect-error
        requiredBy(wrapped, optional);
      });
      test('with specific keys', () => {
        // @ts-expect-error
        requiredBy(wrapped, optional, ['key1', 'key3']);
      });
    });

    describe('should return correct schema', () => {
      test('with modified keys', () => {
        expectTypeOf(requiredBy(wrapped, nonOptional)).toEqualTypeOf<
          Schema1<typeof nonOptional>
        >();
        expectTypeOf(requiredBy(wrapped, nonNullish)).toEqualTypeOf<
          Schema1<typeof nonNullish>
        >();
      });
      test('with specific keys', () => {
        expectTypeOf(
          requiredBy(wrapped, nonOptional, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nonOptional>>();
        expectTypeOf(
          requiredBy(wrapped, nonNullish, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nonNullish>>();
      });
    });

    describe('should infer correct types', () => {
      test('of input', () => {
        expectTypeOf<InferInput<Schema1<typeof nonOptional>>>().toEqualTypeOf<
          {
            key1: string;
            key2: number;
            key3: string | null;
            key4: number | null;
          } & {
            [key: string]: string;
          }
        >();
        expectTypeOf<InferInput<Schema1<typeof nonNullish>>>().toEqualTypeOf<
          {
            key1: string;
            key2: number;
            key3: string;
            key4: number;
          } & {
            [key: string]: string;
          }
        >();
        expectTypeOf<InferInput<Schema2<typeof nonOptional>>>().toEqualTypeOf<
          {
            key1: string;
            key2?: number;
            key3: string | null;
            key4?: number | null;
          } & {
            [key: string]: string;
          }
        >();
        expectTypeOf<InferInput<Schema2<typeof nonNullish>>>().toEqualTypeOf<
          {
            key1: string;
            key2?: number;
            key3: string;
            key4?: number | null;
          } & {
            [key: string]: string;
          }
        >();
      });
      test('of output', () => {
        expectTypeOf<InferOutput<Schema1<typeof nonOptional>>>().toEqualTypeOf<
          {
            key1: string;
            key2: number;
            key3: string | null;
            key4: number;
          } & {
            [key: string]: string;
          }
        >();
        expectTypeOf<InferOutput<Schema1<typeof nonNullish>>>().toEqualTypeOf<
          {
            key1: string;
            key2: number;
            key3: string;
            key4: number;
          } & {
            [key: string]: string;
          }
        >();
        expectTypeOf<InferOutput<Schema2<typeof nonOptional>>>().toEqualTypeOf<
          {
            key1: string;
            key2?: number;
            key3: string | null;
            key4: number;
          } & {
            [key: string]: string;
          }
        >();
        expectTypeOf<InferOutput<Schema2<typeof nonNullish>>>().toEqualTypeOf<
          {
            key1: string;
            key2?: number;
            key3: string;
            key4: number;
          } & {
            [key: string]: string;
          }
        >();
      });
      test('of issue', () => {
        expectTypeOf<InferIssue<Schema1<typeof nonOptional>>>().toEqualTypeOf<
          NonOptionalIssue | ObjectWithRestIssue | StringIssue | NumberIssue
        >();
        expectTypeOf<InferIssue<Schema1<typeof nonNullish>>>().toEqualTypeOf<
          NonNullishIssue | ObjectWithRestIssue | StringIssue | NumberIssue
        >();
        expectTypeOf<InferIssue<Schema2<typeof nonOptional>>>().toEqualTypeOf<
          NonOptionalIssue | ObjectWithRestIssue | StringIssue | NumberIssue
        >();
        expectTypeOf<InferIssue<Schema2<typeof nonNullish>>>().toEqualTypeOf<
          NonNullishIssue | ObjectWithRestIssue | StringIssue | NumberIssue
        >();
      });
    });
  });
});
