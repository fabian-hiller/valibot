import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { ipCidr, type IpCidrAction, type IpCidrIssue } from './ipCidr.ts';

describe('ipCidr', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IpCidrAction<string, undefined>;
      expectTypeOf(ipCidr<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        ipCidr<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(ipCidr<string, 'message'>('message')).toEqualTypeOf<
        IpCidrAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(ipCidr<string, () => string>(() => 'message')).toEqualTypeOf<
        IpCidrAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = IpCidrAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<IpCidrIssue<string>>();
    });
  });
});
