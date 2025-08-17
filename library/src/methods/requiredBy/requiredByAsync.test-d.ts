import { describe, expectTypeOf, test } from 'vitest';
import {
  boolean,
  type BooleanIssue,
  nonNullishAsync,
  type NonNullishIssue,
  nonOptionalAsync,
  type NonOptionalIssue,
  nullishAsync,
  number,
  type NumberIssue,
  objectAsync,
  type ObjectIssue,
  objectWithRestAsync,
  type ObjectWithRestIssue,
  optional,
  optionalAsync,
  string,
  type StringIssue,
} from '../../schemas/index.ts';
import type { BaseHKTable, HKTImplementation } from '../../types/hkt.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  requiredByAsync,
  type RequiredByModifierAsyncHKT,
  type SchemaWithRequiredByAsync,
} from './requiredByAsync.ts';

type ModifierImpl = HKTImplementation<BaseHKTable<RequiredByModifierAsyncHKT>>;

describe('requiredByAsync', () => {
  const entries = {
    key1: optional(string()),
    key2: optional(number()),
    key3: nullishAsync(string()),
    key4: nullishAsync(number(), async () => 123),
  };

  describe('objectAsync', () => {
    const wrapped = objectAsync(entries);
    type Wrapped = typeof wrapped;
    type Schema1<
      TModifier extends ModifierImpl,
      TMessage extends string | undefined = undefined,
    > = SchemaWithRequiredByAsync<
      Wrapped,
      ReturnType<TModifier>,
      undefined,
      TMessage
    >;
    type Schema2<
      TModifier extends ModifierImpl,
      TMessage extends string | undefined = undefined,
    > = SchemaWithRequiredByAsync<
      Wrapped,
      ReturnType<TModifier>,
      ['key1', 'key3'],
      TMessage
    >;

    describe('should require modifier to support correct HKT', () => {
      test('with modified keys', () => {
        // @ts-expect-error
        requiredByAsync(wrapped, optionalAsync);
      });
      test('with modified keys and message', () => {
        // @ts-expect-error
        requiredByAsync(wrapped, optionalAsync, 'message');
      });
      test('with specific keys', () => {
        // @ts-expect-error
        requiredByAsync(wrapped, optionalAsync, ['key1', 'key3']);
      });
      test('with specific keys and message', () => {
        // @ts-expect-error
        requiredByAsync(wrapped, optionalAsync, ['key1', 'key3'], 'message');
      });
    });

    describe('should return correct schema', () => {
      test('with modified keys', () => {
        expectTypeOf(requiredByAsync(wrapped, nonOptionalAsync)).toEqualTypeOf<
          Schema1<typeof nonOptionalAsync>
        >();
        expectTypeOf(requiredByAsync(wrapped, nonNullishAsync)).toEqualTypeOf<
          Schema1<typeof nonNullishAsync>
        >();
      });
      test('with modified keys and message', () => {
        expectTypeOf(
          requiredByAsync(wrapped, nonOptionalAsync, 'message')
        ).toEqualTypeOf<Schema1<typeof nonOptionalAsync, 'message'>>();
        expectTypeOf(
          requiredByAsync(wrapped, nonNullishAsync, 'message')
        ).toEqualTypeOf<Schema1<typeof nonNullishAsync, 'message'>>();
      });
      test('with specific keys', () => {
        expectTypeOf(
          requiredByAsync(wrapped, nonOptionalAsync, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nonOptionalAsync>>();
        expectTypeOf(
          requiredByAsync(wrapped, nonNullishAsync, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nonNullishAsync>>();
      });
      test('with specific keys and message', () => {
        expectTypeOf(
          requiredByAsync(
            wrapped,
            nonOptionalAsync,
            ['key1', 'key3'],
            'message'
          )
        ).toEqualTypeOf<Schema2<typeof nonOptionalAsync, 'message'>>();
        expectTypeOf(
          requiredByAsync(wrapped, nonNullishAsync, ['key1', 'key3'], 'message')
        ).toEqualTypeOf<Schema2<typeof nonNullishAsync, 'message'>>();
      });
    });

    describe('should infer correct types', () => {
      test('of input', () => {
        expectTypeOf<
          InferInput<Schema1<typeof nonOptionalAsync>>
        >().toEqualTypeOf<{
          key1: string;
          key2: number;
          key3: string | null;
          key4: number | null;
        }>();
        expectTypeOf<
          InferInput<Schema1<typeof nonNullishAsync>>
        >().toEqualTypeOf<{
          key1: string;
          key2: number;
          key3: string;
          key4: number;
        }>();
        expectTypeOf<
          InferInput<Schema2<typeof nonOptionalAsync>>
        >().toEqualTypeOf<{
          key1: string;
          key2?: number;
          key3: string | null;
          key4?: number | null;
        }>();
        expectTypeOf<
          InferInput<Schema2<typeof nonNullishAsync>>
        >().toEqualTypeOf<{
          key1: string;
          key2?: number;
          key3: string;
          key4?: number | null;
        }>();
      });

      test('of output', () => {
        expectTypeOf<
          InferOutput<Schema1<typeof nonOptionalAsync>>
        >().toEqualTypeOf<{
          key1: string;
          key2: number;
          key3: string | null;
          key4: number;
        }>();
        expectTypeOf<
          InferOutput<Schema1<typeof nonNullishAsync>>
        >().toEqualTypeOf<{
          key1: string;
          key2: number;
          key3: string;
          key4: number;
        }>();
        expectTypeOf<
          InferOutput<Schema2<typeof nonOptionalAsync>>
        >().toEqualTypeOf<{
          key1: string;
          key2?: number;
          key3: string | null;
          key4: number;
        }>();
        expectTypeOf<
          InferOutput<Schema2<typeof nonNullishAsync>>
        >().toEqualTypeOf<{
          key1: string;
          key2?: number;
          key3: string;
          key4: number;
        }>();
      });

      test('of issue', () => {
        expectTypeOf<
          InferIssue<Schema1<typeof nonOptionalAsync>>
        >().toEqualTypeOf<
          NonOptionalIssue | ObjectIssue | StringIssue | NumberIssue
        >();
        expectTypeOf<
          InferIssue<Schema1<typeof nonNullishAsync>>
        >().toEqualTypeOf<
          NonNullishIssue | ObjectIssue | StringIssue | NumberIssue
        >();
        expectTypeOf<
          InferIssue<Schema2<typeof nonOptionalAsync>>
        >().toEqualTypeOf<
          NonOptionalIssue | ObjectIssue | StringIssue | NumberIssue
        >();
        expectTypeOf<
          InferIssue<Schema2<typeof nonNullishAsync>>
        >().toEqualTypeOf<
          NonNullishIssue | ObjectIssue | StringIssue | NumberIssue
        >();
      });
    });
  });

  describe('objectWithRestAsync', () => {
    const rest = boolean();
    const wrapped = objectWithRestAsync(entries, rest);
    type Wrapped = typeof wrapped;
    type Schema1<TModifier extends ModifierImpl> = SchemaWithRequiredByAsync<
      Wrapped,
      ReturnType<TModifier>,
      undefined,
      undefined
    >;
    type Schema2<TModifier extends ModifierImpl> = SchemaWithRequiredByAsync<
      Wrapped,
      ReturnType<TModifier>,
      ['key1', 'key3'],
      undefined
    >;

    describe('should require modifier to support correct HKT', () => {
      test('with modified keys', () => {
        // @ts-expect-error
        requiredByAsync(wrapped, optionalAsync);
      });
      test('with specific keys', () => {
        // @ts-expect-error
        requiredByAsync(wrapped, optionalAsync, ['key1', 'key3']);
      });
    });

    describe('should return correct schema', () => {
      test('with modified keys', () => {
        expectTypeOf(requiredByAsync(wrapped, nonOptionalAsync)).toEqualTypeOf<
          Schema1<typeof nonOptionalAsync>
        >();
        expectTypeOf(requiredByAsync(wrapped, nonNullishAsync)).toEqualTypeOf<
          Schema1<typeof nonNullishAsync>
        >();
      });
      test('with specific keys', () => {
        expectTypeOf(
          requiredByAsync(wrapped, nonOptionalAsync, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nonOptionalAsync>>();
        expectTypeOf(
          requiredByAsync(wrapped, nonNullishAsync, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2<typeof nonNullishAsync>>();
      });
    });

    describe('should infer correct types', () => {
      test('of input', () => {
        expectTypeOf<
          InferInput<Schema1<typeof nonOptionalAsync>>
        >().toEqualTypeOf<
          {
            key1: string;
            key2: number;
            key3: string | null;
            key4: number | null;
          } & {
            [key: string]: boolean;
          }
        >();
        expectTypeOf<
          InferInput<Schema1<typeof nonNullishAsync>>
        >().toEqualTypeOf<
          {
            key1: string;
            key2: number;
            key3: string;
            key4: number;
          } & {
            [key: string]: boolean;
          }
        >();
        expectTypeOf<
          InferInput<Schema2<typeof nonOptionalAsync>>
        >().toEqualTypeOf<
          {
            key1: string;
            key2?: number;
            key3: string | null;
            key4?: number | null;
          } & {
            [key: string]: boolean;
          }
        >();
        expectTypeOf<
          InferInput<Schema2<typeof nonNullishAsync>>
        >().toEqualTypeOf<
          {
            key1: string;
            key2?: number;
            key3: string;
            key4?: number | null;
          } & {
            [key: string]: boolean;
          }
        >();
      });

      test('of output', () => {
        expectTypeOf<
          InferOutput<Schema1<typeof nonOptionalAsync>>
        >().toEqualTypeOf<
          {
            key1: string;
            key2: number;
            key3: string | null;
            key4: number;
          } & {
            [key: string]: boolean;
          }
        >();
        expectTypeOf<
          InferOutput<Schema1<typeof nonNullishAsync>>
        >().toEqualTypeOf<
          {
            key1: string;
            key2: number;
            key3: string;
            key4: number;
          } & {
            [key: string]: boolean;
          }
        >();
        expectTypeOf<
          InferOutput<Schema2<typeof nonOptionalAsync>>
        >().toEqualTypeOf<
          {
            key1: string;
            key2?: number;
            key3: string | null;
            key4: number;
          } & {
            [key: string]: boolean;
          }
        >();
        expectTypeOf<
          InferOutput<Schema2<typeof nonNullishAsync>>
        >().toEqualTypeOf<
          {
            key1: string;
            key2?: number;
            key3: string;
            key4: number;
          } & {
            [key: string]: boolean;
          }
        >();
      });

      test('of issue', () => {
        expectTypeOf<
          InferIssue<Schema1<typeof nonOptionalAsync>>
        >().toEqualTypeOf<
          | NonOptionalIssue
          | ObjectWithRestIssue
          | StringIssue
          | NumberIssue
          | BooleanIssue
        >();
        expectTypeOf<
          InferIssue<Schema1<typeof nonNullishAsync>>
        >().toEqualTypeOf<
          | NonNullishIssue
          | ObjectWithRestIssue
          | StringIssue
          | NumberIssue
          | BooleanIssue
        >();
        expectTypeOf<
          InferIssue<Schema2<typeof nonOptionalAsync>>
        >().toEqualTypeOf<
          | NonOptionalIssue
          | ObjectWithRestIssue
          | StringIssue
          | NumberIssue
          | BooleanIssue
        >();
        expectTypeOf<
          InferIssue<Schema2<typeof nonNullishAsync>>
        >().toEqualTypeOf<
          | NonNullishIssue
          | ObjectWithRestIssue
          | StringIssue
          | NumberIssue
          | BooleanIssue
        >();
      });
    });
  });
});
