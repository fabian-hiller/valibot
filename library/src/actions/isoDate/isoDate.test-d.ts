import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { isoDate, type IsoDateAction, type IsoDateIssue } from './isoDate.ts';

describe('isoDate', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IsoDateAction<string, undefined>;
      expectTypeOf(isoDate<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        isoDate<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(isoDate<string, 'message'>('message')).toEqualTypeOf<
        IsoDateAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        isoDate<string, () => string>(() => 'message')
      ).toEqualTypeOf<IsoDateAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = IsoDateAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<IsoDateIssue<string>>();
    });
  });
});
