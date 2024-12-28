import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type {} from '../email/email.ts';
import {
  rfcEmail,
  type RfcEmailAction,
  type RfcEmailIssue,
} from './rfcEmail.ts';

describe('rfcEmail', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = RfcEmailAction<string, undefined>;
      expectTypeOf(rfcEmail()).toEqualTypeOf<Action>();
      expectTypeOf(rfcEmail(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(rfcEmail('message')).toEqualTypeOf<
        RfcEmailAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(rfcEmail(() => 'message')).toEqualTypeOf<
        RfcEmailAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = RfcEmailAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<RfcEmailIssue<string>>();
    });
  });
});
