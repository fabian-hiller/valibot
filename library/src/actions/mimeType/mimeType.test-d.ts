import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  mimeType,
  type MimeTypeAction,
  type MimeTypeIssue,
} from './mimeType.ts';

describe('mimeType', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = MimeTypeAction<Blob, ['text/html', 'image/png'], undefined>;
      expectTypeOf(
        mimeType<Blob, ['text/html', 'image/png']>(['text/html', 'image/png'])
      ).toEqualTypeOf<Action>();
      expectTypeOf(
        mimeType<Blob, ['text/html', 'image/png'], undefined>(
          ['text/html', 'image/png'],
          undefined
        )
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        mimeType<Blob, ['text/html', 'image/png'], 'message'>(
          ['text/html', 'image/png'],
          'message'
        )
      ).toEqualTypeOf<
        MimeTypeAction<Blob, ['text/html', 'image/png'], 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        mimeType<Blob, ['text/html', 'image/png'], () => string>(
          ['text/html', 'image/png'],
          () => 'message'
        )
      ).toEqualTypeOf<
        MimeTypeAction<Blob, ['text/html', 'image/png'], () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = MimeTypeAction<Blob, ['image/png'], undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<Blob>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<Blob>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        MimeTypeIssue<Blob, ['image/png']>
      >();
    });
  });
});
