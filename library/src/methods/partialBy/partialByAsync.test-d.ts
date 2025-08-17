import { describe, expectTypeOf, test } from 'vitest';
import {
  boolean,
  type BooleanIssue,
  nullishAsync,
  number,
  type NumberIssue,
  objectAsync,
  type ObjectIssue,
  objectWithRestAsync,
  type ObjectWithRestIssue,
  optionalAsync,
  string,
  type StringIssue,
} from '../../schemas/index.ts';
import type { BaseHKTable, HKTImplementation } from '../../types/hkt.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  partialByAsync,
  type PartialByModifierAsyncHKT,
  type SchemaWithPartialByAsync,
} from './partialByAsync.ts';

type ModifierImpl = HKTImplementation<BaseHKTable<PartialByModifierAsyncHKT>>;

describe('partialByAsync', () => {
  const entries = {
    key1: string(),
    key2: number(),
    key3: string(),
    key4: nullishAsync(number(), async () => 123),
  };

  describe('objectAsync', () => {
    const wrapped = objectAsync(entries);
    type Wrapped = typeof wrapped;
    type Schema1<TModifier extends ModifierImpl> = SchemaWithPartialByAsync<
      Wrapped,
      ReturnType<TModifier>,
      undefined
    >;
    type Schema2<TModifier extends ModifierImpl> = SchemaWithPartialByAsync<
      Wrapped,
      ReturnType<TModifier>,
      ['key1', 'key3']
    >;

    describe('should return schema objectAsync', () => {
      test('with modified keys', () => {
        expectTypeOf(partialByAsync(wrapped, optionalAsync)).toEqualTypeOf<
          Schema1<typeof optionalAsync>
        >();
        expectTypeOf(partialByAsync(wrapped, nullishAsync)).toEqualTypeOf<
          Schema1<typeof nullishAsync>
        >();
      });
      test('with specific keys', () => {
        expectTypeOf(
          partialByAsync(wrapped, optionalAsync, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof optionalAsync>>();
        expectTypeOf(
          partialByAsync(wrapped, nullishAsync, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nullishAsync>>();
      });

      describe('should infer correct types', () => {
        test('of input', () => {
          expectTypeOf<
            InferInput<Schema1<typeof optionalAsync>>
          >().toEqualTypeOf<{
            key1?: string;
            key2?: number;
            key3?: string;
            key4?: number | null;
          }>();
          expectTypeOf<
            InferInput<Schema1<typeof nullishAsync>>
          >().toEqualTypeOf<{
            key1?: string | null;
            key2?: number | null;
            key3?: string | null;
            key4?: number | null;
          }>();
          expectTypeOf<
            InferInput<Schema2<typeof optionalAsync>>
          >().toEqualTypeOf<{
            key1?: string;
            key2: number;
            key3?: string;
            key4?: number | null | undefined;
          }>();
          expectTypeOf<
            InferInput<Schema2<typeof nullishAsync>>
          >().toEqualTypeOf<{
            key1?: string | null | undefined;
            key2: number;
            key3?: string | null | undefined;
            key4?: number | null | undefined;
          }>();
        });

        test('of output', () => {
          expectTypeOf<
            InferOutput<Schema1<typeof optionalAsync>>
          >().toEqualTypeOf<{
            key1?: string;
            key2?: number;
            key3?: string;
            key4?: number;
          }>();
          expectTypeOf<
            InferOutput<Schema1<typeof nullishAsync>>
          >().toEqualTypeOf<{
            key1?: string | null;
            key2?: number | null;
            key3?: string | null;
            key4?: number | null;
          }>();
          expectTypeOf<
            InferOutput<Schema2<typeof optionalAsync>>
          >().toEqualTypeOf<{
            key1?: string;
            key2: number;
            key3?: string;
            key4: number;
          }>();
          expectTypeOf<
            InferOutput<Schema2<typeof nullishAsync>>
          >().toEqualTypeOf<{
            key1?: string | null;
            key2: number;
            key3?: string | null;
            key4: number;
          }>();
        });

        test('of issue', () => {
          expectTypeOf<
            InferIssue<Schema1<typeof optionalAsync>>
          >().toEqualTypeOf<ObjectIssue | StringIssue | NumberIssue>();
          expectTypeOf<
            InferIssue<Schema1<typeof nullishAsync>>
          >().toEqualTypeOf<ObjectIssue | StringIssue | NumberIssue>();
          expectTypeOf<
            InferIssue<Schema2<typeof optionalAsync>>
          >().toEqualTypeOf<ObjectIssue | StringIssue | NumberIssue>();
          expectTypeOf<
            InferIssue<Schema2<typeof nullishAsync>>
          >().toEqualTypeOf<ObjectIssue | StringIssue | NumberIssue>();
        });
      });
    });
  });
  describe('objectWithRestAsync', () => {
    const rest = boolean();
    const wrapped = objectWithRestAsync(entries, rest);
    type Wrapped = typeof wrapped;
    type Schema1<TModifier extends ModifierImpl> = SchemaWithPartialByAsync<
      Wrapped,
      ReturnType<TModifier>,
      undefined
    >;
    type Schema2<TModifier extends ModifierImpl> = SchemaWithPartialByAsync<
      Wrapped,
      ReturnType<TModifier>,
      ['key1', 'key3']
    >;

    describe('should return schema objectWithRestAsync', () => {
      test('with modified keys', () => {
        expectTypeOf(partialByAsync(wrapped, optionalAsync)).toEqualTypeOf<
          Schema1<typeof optionalAsync>
        >();
        expectTypeOf(partialByAsync(wrapped, nullishAsync)).toEqualTypeOf<
          Schema1<typeof nullishAsync>
        >();
      });
      test('with specific keys', () => {
        expectTypeOf(
          partialByAsync(wrapped, optionalAsync, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof optionalAsync>>();
        expectTypeOf(
          partialByAsync(wrapped, nullishAsync, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nullishAsync>>();
      });

      describe('should infer correct types', () => {
        test('of input', () => {
          expectTypeOf<
            InferInput<Schema1<typeof optionalAsync>>
          >().toEqualTypeOf<
            {
              key1?: string;
              key2?: number;
              key3?: string;
              key4?: number | null;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<
            InferInput<Schema1<typeof nullishAsync>>
          >().toEqualTypeOf<
            {
              key1?: string | null | undefined;
              key2?: number | null | undefined;
              key3?: string | null | undefined;
              key4?: number | null | undefined;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<
            InferInput<Schema2<typeof optionalAsync>>
          >().toEqualTypeOf<
            {
              key1?: string;
              key2: number;
              key3?: string;
              key4?: number | null;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<
            InferInput<Schema2<typeof nullishAsync>>
          >().toEqualTypeOf<
            {
              key1?: string | null | undefined;
              key2: number;
              key3?: string | null | undefined;
              key4?: number | null;
            } & {
              [key: string]: boolean;
            }
          >();
        });

        test('of output', () => {
          expectTypeOf<
            InferOutput<Schema1<typeof optionalAsync>>
          >().toEqualTypeOf<
            {
              key1?: string;
              key2?: number;
              key3?: string;
              key4?: number;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<
            InferOutput<Schema1<typeof nullishAsync>>
          >().toEqualTypeOf<
            {
              key1?: string | null;
              key2?: number | null;
              key3?: string | null;
              key4?: number | null;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<
            InferOutput<Schema2<typeof optionalAsync>>
          >().toEqualTypeOf<
            {
              key1?: string;
              key2: number;
              key3?: string;
              key4: number;
            } & {
              [key: string]: boolean;
            }
          >();
          expectTypeOf<
            InferOutput<Schema2<typeof nullishAsync>>
          >().toEqualTypeOf<
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
          expectTypeOf<
            InferIssue<Schema1<typeof optionalAsync>>
          >().toEqualTypeOf<
            ObjectWithRestIssue | StringIssue | NumberIssue | BooleanIssue
          >();
          expectTypeOf<
            InferIssue<Schema1<typeof nullishAsync>>
          >().toEqualTypeOf<
            ObjectWithRestIssue | StringIssue | NumberIssue | BooleanIssue
          >();
          expectTypeOf<
            InferIssue<Schema2<typeof optionalAsync>>
          >().toEqualTypeOf<
            ObjectWithRestIssue | StringIssue | NumberIssue | BooleanIssue
          >();
          expectTypeOf<
            InferIssue<Schema2<typeof nullishAsync>>
          >().toEqualTypeOf<
            ObjectWithRestIssue | StringIssue | NumberIssue | BooleanIssue
          >();
        });
      });
    });
  });
});
