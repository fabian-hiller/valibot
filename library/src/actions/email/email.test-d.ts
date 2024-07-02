import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { email, type EmailAction, type EmailIssue } from './email.ts';

describe('email', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = EmailAction<string, undefined>;
      expectTypeOf(email()).toEqualTypeOf<Action>();
      expectTypeOf(email(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(email('message')).toEqualTypeOf<
        EmailAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(email(() => 'message')).toEqualTypeOf<
        EmailAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = EmailAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<EmailIssue<string>>();
    });
  });
});
