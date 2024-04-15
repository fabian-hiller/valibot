import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { IsoTimeAction, IsoTimeIssue } from './isoTime.ts';
import { isoTime } from './isoTime.ts';

describe('isoTime', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IsoTimeAction<string, undefined>;
      expectTypeOf(isoTime<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        isoTime<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(isoTime<string, 'message'>('message')).toEqualTypeOf<
        IsoTimeAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        isoTime<string, () => string>(() => 'message')
      ).toEqualTypeOf<IsoTimeAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = IsoTimeAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<IsoTimeIssue<string>>();
    });
  });
});
