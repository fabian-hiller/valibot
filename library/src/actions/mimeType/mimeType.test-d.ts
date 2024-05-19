import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  mimeType,
  type MimeTypeAction,
  type MimeTypeIssue,
} from './mimeType.ts';

describe('mimeType', () => {
  const requirement = ['text/html', 'image/png'] as const;
  type Requirement = typeof requirement;

  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MimeTypeAction<Blob, Requirement, undefined>;
      expectTypeOf(mimeType(requirement)).toEqualTypeOf<Action>();
      expectTypeOf(mimeType(requirement, undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(mimeType(requirement, 'message')).toEqualTypeOf<
        MimeTypeAction<Blob, Requirement, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(mimeType(requirement, () => 'message')).toEqualTypeOf<
        MimeTypeAction<Blob, Requirement, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = MimeTypeAction<Blob, Requirement, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Blob>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Blob>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MimeTypeIssue<Blob, Requirement>
      >();
    });
  });
});
