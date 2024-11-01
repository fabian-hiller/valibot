import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  domainName,
  type DomainNameAction,
  type DomainNameIssue,
} from './domainName.ts';

describe('domainName', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = DomainNameAction<string, undefined>;
      expectTypeOf(domainName()).toEqualTypeOf<Action>();
      expectTypeOf(domainName(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(domainName('message')).toEqualTypeOf<
        DomainNameAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(domainName(() => 'message')).toEqualTypeOf<
        DomainNameAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = DomainNameAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        DomainNameIssue<string>
      >();
    });
  });
});
