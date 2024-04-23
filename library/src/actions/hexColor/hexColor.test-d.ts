import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  hexColor,
  type HexColorAction,
  type HexColorIssue,
} from './hexColor.ts';

describe('hexColor', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = HexColorAction<string, undefined>;
      expectTypeOf(hexColor()).toEqualTypeOf<Action>();
      expectTypeOf(hexColor(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(hexColor('message')).toEqualTypeOf<
        HexColorAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(hexColor(() => 'message')).toEqualTypeOf<
        HexColorAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = HexColorAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<HexColorIssue<string>>();
    });
  });
});
