import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  isoTimeSecond,
  type IsoTimeSecondAction,
  type IsoTimeSecondIssue,
} from './isoTimeSecond.ts';

describe('isoTimeSecond', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IsoTimeSecondAction<string, undefined>;
      expectTypeOf(isoTimeSecond<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        isoTimeSecond<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(isoTimeSecond<string, 'message'>('message')).toEqualTypeOf<
        IsoTimeSecondAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        isoTimeSecond<string, () => string>(() => 'message')
      ).toEqualTypeOf<IsoTimeSecondAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = IsoTimeSecondAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        IsoTimeSecondIssue<string>
      >();
    });
  });
});
