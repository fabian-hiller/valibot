import { describe, expectTypeOf, test } from 'vitest';
import {
  null_,
  number,
  object,
  type PicklistIssue,
  type PicklistSchema,
  string,
  unknown,
} from '../../schemas/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { keyof } from './keyof.ts';

describe('keyof', () => {
  const objectSchema = object({ foo: string(), bar: number(), baz: null_() });
  type Options = ['foo', 'bar', 'baz'];

  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = PicklistSchema<Options, undefined>;
      expectTypeOf(keyof(objectSchema)).toEqualTypeOf<Schema>();
      expectTypeOf(keyof(objectSchema, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(keyof(objectSchema, 'message')).toEqualTypeOf<
        PicklistSchema<Options, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(keyof(objectSchema, () => 'message')).toEqualTypeOf<
        PicklistSchema<Options, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = PicklistSchema<Options, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<'foo' | 'bar' | 'baz'>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        'foo' | 'bar' | 'baz'
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PicklistIssue>();
    });
  });

  test('should not trigger TS error for many keys', () => {
    expectTypeOf(
      keyof(
        object({
          k00: unknown(),
          k01: unknown(),
          k02: unknown(),
          k03: unknown(),
          k04: unknown(),
          k05: unknown(),
          k06: unknown(),
          k07: unknown(),
          k08: unknown(),
          k09: unknown(),
          k10: unknown(),
          k11: unknown(),
          k12: unknown(),
          k13: unknown(),
          k14: unknown(),
          k15: unknown(),
          k16: unknown(),
          k17: unknown(),
          k18: unknown(),
          k19: unknown(),
          k20: unknown(),
          k21: unknown(),
          k22: unknown(),
          k23: unknown(),
          k24: unknown(),
          k25: unknown(),
          k26: unknown(),
          k27: unknown(),
          k28: unknown(),
          k29: unknown(),
          k30: unknown(),
          k31: unknown(),
          k32: unknown(),
          k33: unknown(),
          k34: unknown(),
          k35: unknown(),
          k36: unknown(),
          k37: unknown(),
          k38: unknown(),
          k39: unknown(),
          k40: unknown(),
          k41: unknown(),
          k42: unknown(),
          k43: unknown(),
          k44: unknown(),
          k45: unknown(),
          k46: unknown(),
          k47: unknown(),
          k48: unknown(),
          k49: unknown(),
          k50: unknown(),
          k51: unknown(),
          k52: unknown(),
          k53: unknown(),
          k54: unknown(),
          k55: unknown(),
          k56: unknown(),
          k57: unknown(),
          k58: unknown(),
          k59: unknown(),
          k60: unknown(),
        })
      )
    ).toEqualTypeOf<
      PicklistSchema<
        [
          'k00',
          'k01',
          'k02',
          'k03',
          'k04',
          'k05',
          'k06',
          'k07',
          'k08',
          'k09',
          'k10',
          'k11',
          'k12',
          'k13',
          'k14',
          'k15',
          'k16',
          'k17',
          'k18',
          'k19',
          'k20',
          'k21',
          'k22',
          'k23',
          'k24',
          'k25',
          'k26',
          'k27',
          'k28',
          'k29',
          'k30',
          'k31',
          'k32',
          'k33',
          'k34',
          'k35',
          'k36',
          'k37',
          'k38',
          'k39',
          'k40',
          'k41',
          'k42',
          'k43',
          'k44',
          'k45',
          'k46',
          'k47',
          'k48',
          'k49',
          'k50',
          'k51',
          'k52',
          'k53',
          'k54',
          'k55',
          'k56',
          'k57',
          'k58',
          'k59',
          'k60',
        ],
        undefined
      >
    >();
  });
});
