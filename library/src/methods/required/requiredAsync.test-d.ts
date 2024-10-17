import { describe, expectTypeOf, test } from 'vitest';
import {
  boolean,
  type BooleanIssue,
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
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  requiredAsync,
  type SchemaWithRequiredAsync,
} from './requiredAsync.ts';

describe('requiredAsync', () => {
  const entries = {
    key1: optional(string()),
    key2: optional(number()),
    key3: optionalAsync(string()),
    key4: nullishAsync(number(), async () => 123),
  };

  describe('objectAsync', () => {
    const wrapped = objectAsync(entries);
    type Wrapped = typeof wrapped;
    type Schema1 = SchemaWithRequiredAsync<Wrapped, undefined, undefined>;
    type Schema1WithMsg = SchemaWithRequiredAsync<
      Wrapped,
      undefined,
      'custom error message'
    >;
    type Schema2 = SchemaWithRequiredAsync<
      Wrapped,
      ['key1', 'key3'],
      undefined
    >;
    type Schema2WithMsg = SchemaWithRequiredAsync<
      Wrapped,
      ['key1', 'key3'],
      'custom error message'
    >;

    describe('should return schema object', () => {
      test('with undefined keys', () => {
        expectTypeOf(requiredAsync(wrapped)).toEqualTypeOf<Schema1>();
      });

      test('with undefined keys and custom required message', () => {
        expectTypeOf(
          requiredAsync(wrapped, 'custom error message')
        ).toEqualTypeOf<Schema1WithMsg>();
      });

      test('with specific keys', () => {
        expectTypeOf(
          requiredAsync(wrapped, ['key1', 'key3'])
        ).toEqualTypeOf<Schema2>();
      });

      test('with specific keys and custom required message', () => {
        expectTypeOf(
          requiredAsync(wrapped, ['key1', 'key3'], 'custom error message')
        ).toEqualTypeOf<Schema2WithMsg>();
      });
    });

    describe('should infer correct types', () => {
      describe('of input from schemas', () => {
        test('with no custom required message', () => {
          expectTypeOf<InferInput<Schema1>>().toEqualTypeOf<{
            key1: string;
            key2: number;
            key3: string;
            key4: number | null;
          }>();
          expectTypeOf<InferInput<Schema2>>().toEqualTypeOf<{
            key1: string;
            key2?: number;
            key3: string;
            key4?: number | null;
          }>();
        });

        test('with custom required message', () => {
          expectTypeOf<InferInput<Schema1WithMsg>>().toEqualTypeOf<{
            key1: string;
            key2: number;
            key3: string;
            key4: number | null;
          }>();
          expectTypeOf<InferInput<Schema2WithMsg>>().toEqualTypeOf<{
            key1: string;
            key2?: number;
            key3: string;
            key4?: number | null;
          }>();
        });
      });

      describe('of output from schemas', () => {
        test('with no custom required message', () => {
          expectTypeOf<InferOutput<Schema1>>().toEqualTypeOf<{
            key1: string;
            key2: number;
            key3: string;
            key4: number;
          }>();
          expectTypeOf<InferOutput<Schema2>>().toEqualTypeOf<{
            key1: string;
            key2?: number;
            key3: string;
            key4: number;
          }>();
        });

        test('with custom required message', () => {
          expectTypeOf<InferOutput<Schema1WithMsg>>().toEqualTypeOf<{
            key1: string;
            key2: number;
            key3: string;
            key4: number;
          }>();
          expectTypeOf<InferOutput<Schema2WithMsg>>().toEqualTypeOf<{
            key1: string;
            key2?: number;
            key3: string;
            key4: number;
          }>();
        });
      });

      describe('of issue from schemas', () => {
        test('with no custom required message', () => {
          expectTypeOf<InferIssue<Schema1>>().toEqualTypeOf<
            NonOptionalIssue | ObjectIssue | StringIssue | NumberIssue
          >();
          expectTypeOf<InferIssue<Schema2>>().toEqualTypeOf<
            NonOptionalIssue | ObjectIssue | StringIssue | NumberIssue
          >();
        });

        test('with custom required message', () => {
          expectTypeOf<InferIssue<Schema1WithMsg>>().toEqualTypeOf<
            NonOptionalIssue | ObjectIssue | StringIssue | NumberIssue
          >();
          expectTypeOf<InferIssue<Schema2WithMsg>>().toEqualTypeOf<
            NonOptionalIssue | ObjectIssue | StringIssue | NumberIssue
          >();
        });
      });
    });
  });

  describe('objectWithRestAsync', () => {
    const wrapped = objectWithRestAsync(entries, boolean());
    type Wrapped = typeof wrapped;
    type Schema1 = SchemaWithRequiredAsync<Wrapped, undefined, undefined>;
    type Schema1WithMsg = SchemaWithRequiredAsync<
      Wrapped,
      undefined,
      'custom error message'
    >;
    type Schema2 = SchemaWithRequiredAsync<
      Wrapped,
      ['key2', 'key3'],
      undefined
    >;
    type Schema2WithMsg = SchemaWithRequiredAsync<
      Wrapped,
      ['key2', 'key3'],
      'custom error message'
    >;

    describe('should return schema object', () => {
      test('with undefined keys', () => {
        expectTypeOf(requiredAsync(wrapped)).toEqualTypeOf<Schema1>();
      });

      test('with undefined keys and custom required message', () => {
        expectTypeOf(
          requiredAsync(wrapped, 'custom error message')
        ).toEqualTypeOf<Schema1WithMsg>();
      });

      test('with specific keys', () => {
        expectTypeOf(
          requiredAsync(wrapped, ['key2', 'key3'])
        ).toEqualTypeOf<Schema2>();
      });

      test('with specific keys and custom required message', () => {
        expectTypeOf(
          requiredAsync(wrapped, ['key2', 'key3'], 'custom error message')
        ).toEqualTypeOf<Schema2WithMsg>();
      });
    });

    describe('should infer correct types', () => {
      describe('of input from schemas', () => {
        test('with no custom required message', () => {
          expectTypeOf<InferInput<Schema1>>().toEqualTypeOf<
            {
              key1: string;
              key2: number;
              key3: string;
              key4: number | null;
            } & { [key: string]: boolean }
          >();
          expectTypeOf<InferInput<Schema2>>().toEqualTypeOf<
            {
              key1?: string;
              key2: number;
              key3: string;
              key4?: number | null;
            } & { [key: string]: boolean }
          >();
        });

        test('with custom required message', () => {
          expectTypeOf<InferInput<Schema1WithMsg>>().toEqualTypeOf<
            {
              key1: string;
              key2: number;
              key3: string;
              key4: number | null;
            } & { [key: string]: boolean }
          >();
          expectTypeOf<InferInput<Schema2WithMsg>>().toEqualTypeOf<
            {
              key1?: string;
              key2: number;
              key3: string;
              key4?: number | null;
            } & { [key: string]: boolean }
          >();
        });
      });

      describe('of output from schemas', () => {
        test('with no custom required message', () => {
          expectTypeOf<InferOutput<Schema1>>().toEqualTypeOf<
            {
              key1: string;
              key2: number;
              key3: string;
              key4: number;
            } & { [key: string]: boolean }
          >();
          expectTypeOf<InferOutput<Schema2>>().toEqualTypeOf<
            {
              key1?: string;
              key2: number;
              key3: string;
              key4: number;
            } & { [key: string]: boolean }
          >();
        });

        test('with custom required message', () => {
          expectTypeOf<InferOutput<Schema1WithMsg>>().toEqualTypeOf<
            {
              key1: string;
              key2: number;
              key3: string;
              key4: number;
            } & { [key: string]: boolean }
          >();
          expectTypeOf<InferOutput<Schema2WithMsg>>().toEqualTypeOf<
            {
              key1?: string;
              key2: number;
              key3: string;
              key4: number;
            } & { [key: string]: boolean }
          >();
        });
      });

      describe('of issue from schemas', () => {
        test('with no custom required message', () => {
          expectTypeOf<InferIssue<Schema1>>().toEqualTypeOf<
            | NonOptionalIssue
            | ObjectWithRestIssue
            | NumberIssue
            | StringIssue
            | BooleanIssue
          >();
          expectTypeOf<InferIssue<Schema2>>().toEqualTypeOf<
            | NonOptionalIssue
            | ObjectWithRestIssue
            | NumberIssue
            | StringIssue
            | BooleanIssue
          >();
        });

        test('with custom required message', () => {
          expectTypeOf<InferIssue<Schema1WithMsg>>().toEqualTypeOf<
            | NonOptionalIssue
            | ObjectWithRestIssue
            | NumberIssue
            | StringIssue
            | BooleanIssue
          >();
          expectTypeOf<InferIssue<Schema2WithMsg>>().toEqualTypeOf<
            | NonOptionalIssue
            | ObjectWithRestIssue
            | NumberIssue
            | StringIssue
            | BooleanIssue
          >();
        });
      });
    });
  });
});
