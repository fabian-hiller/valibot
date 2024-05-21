import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  instance,
  type InstanceIssue,
  type InstanceSchema,
} from './instance.ts';

describe('DateConstructor', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = InstanceSchema<DateConstructor, undefined>;
      expectTypeOf(instance(Date)).toEqualTypeOf<Schema>();
      expectTypeOf(instance(Date, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(instance(Date, 'message')).toEqualTypeOf<
        InstanceSchema<DateConstructor, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(instance(Date, () => 'message')).toEqualTypeOf<
        InstanceSchema<DateConstructor, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = InstanceSchema<DateConstructor, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Date>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Date>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<InstanceIssue>();
    });
  });
});
