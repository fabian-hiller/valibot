import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { isoWeek, type IsoWeekAction, type IsoWeekIssue } from './isoWeek.ts';

describe('isoWeek', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IsoWeekAction<string, undefined>;
      expectTypeOf(isoWeek<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        isoWeek<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(isoWeek<string, 'message'>('message')).toEqualTypeOf<
        IsoWeekAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        isoWeek<string, () => string>(() => 'message')
      ).toEqualTypeOf<IsoWeekAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = IsoWeekAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<IsoWeekIssue<string>>();
    });
  });
});
