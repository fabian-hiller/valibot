import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  graphemes,
  type GraphemesAction,
  type GraphemesIssue,
} from './graphemes.ts';

describe('graphemes', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = GraphemesAction<string, 10, undefined>;
      expectTypeOf(graphemes<string, 10>(10)).toEqualTypeOf<Action>();
      expectTypeOf(
        graphemes<string, 10, undefined>(10, undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        graphemes<string, 10, 'message'>(10, 'message')
      ).toEqualTypeOf<GraphemesAction<string, 10, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        graphemes<string, 10, () => string>(10, () => 'message')
      ).toEqualTypeOf<GraphemesAction<string, 10, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Input = 'example string';
    type Action = GraphemesAction<Input, 5, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Input>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Input>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        GraphemesIssue<Input, 5>
      >();
    });
  });
});
