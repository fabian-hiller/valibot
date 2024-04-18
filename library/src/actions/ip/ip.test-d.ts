import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { ip, type IpAction, type IpIssue } from './ip.ts';

describe('ip', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IpAction<string, undefined>;
      expectTypeOf(ip<string>()).toEqualTypeOf<Action>();
      expectTypeOf(ip<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(ip<string, 'message'>('message')).toEqualTypeOf<
        IpAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(ip<string, () => string>(() => 'message')).toEqualTypeOf<
        IpAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = IpAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<IpIssue<string>>();
    });
  });
});
