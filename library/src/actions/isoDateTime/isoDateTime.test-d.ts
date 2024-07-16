import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  isoDateTime,
  type IsoDateTimeAction,
  type IsoDateTimeIssue,
} from './isoDateTime.ts';

describe('isoDateTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IsoDateTimeAction<string, undefined>;
      expectTypeOf(isoDateTime<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        isoDateTime<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(isoDateTime<string, 'message'>('message')).toEqualTypeOf<
        IsoDateTimeAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        isoDateTime<string, () => string>(() => 'message')
      ).toEqualTypeOf<IsoDateTimeAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = IsoDateTimeAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        IsoDateTimeIssue<string>
      >();
    });
  });
});
