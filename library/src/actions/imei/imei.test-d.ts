import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { imei, type ImeiAction, type ImeiIssue } from './imei.ts';

describe('imei', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = ImeiAction<string, undefined>;
      expectTypeOf(imei()).toEqualTypeOf<Action>();
      expectTypeOf(imei(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(imei('message')).toEqualTypeOf<
        ImeiAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(imei(() => 'message')).toEqualTypeOf<
        ImeiAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = ImeiAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<ImeiIssue<string>>();
    });
  });
});
