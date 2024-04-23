import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { IsoTimestampAction, IsoTimestampIssue } from './isoTimestamp.ts';
import { isoTimestamp } from './isoTimestamp.ts';

describe('isoTimestamp', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IsoTimestampAction<string, undefined>;
      expectTypeOf(isoTimestamp<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        isoTimestamp<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(isoTimestamp<string, 'message'>('message')).toEqualTypeOf<
        IsoTimestampAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        isoTimestamp<string, () => string>(() => 'message')
      ).toEqualTypeOf<IsoTimestampAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = IsoTimestampAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        IsoTimestampIssue<string>
      >();
    });
  });
});
