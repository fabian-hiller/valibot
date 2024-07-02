import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  mimeType,
  type MimeTypeAction,
  type MimeTypeIssue,
} from './mimeType.ts';

describe('mimeType', () => {
  const requirement = ['text/html', 'image/png'] as const;
  type Requirement = typeof requirement;

  describe('should return action object', () => {
    const baseAction: Omit<
      MimeTypeAction<Blob, Requirement, never>,
      'message'
    > = {
      kind: 'validation',
      type: 'mime_type',
      reference: mimeType,
      expects: '"text/html" | "image/png"',
      requirement,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MimeTypeAction<Blob, Requirement, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(mimeType(requirement)).toStrictEqual(action);
      expect(mimeType(requirement, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(mimeType(requirement, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MimeTypeAction<Blob, Requirement, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(mimeType(requirement, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MimeTypeAction<Blob, Requirement, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = mimeType(requirement);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid MIME types', () => {
      expectNoActionIssue(action, [
        new Blob(['foo'], { type: 'text/html' }),
        new Blob(['foo'], { type: 'image/png' }),
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = mimeType(requirement, 'message');

    const baseIssue: Omit<
      MimeTypeIssue<Blob, never>,
      'input' | 'received' | 'expected' | 'requirement'
    > = {
      kind: 'validation',
      type: 'mime_type',
      message: 'message',
    };

    test('for valid MIME types', () => {
      expectActionIssue(
        action,
        { ...baseIssue, expected: '"text/html" | "image/png"', requirement },
        [
          new Blob(['foo'], { type: 'text/plain' }),
          new Blob(['foo'], { type: 'image/jpeg' }),
        ],
        (input) => `"${input.type}"`
      );
    });

    test('for empty requirement', () => {
      expectActionIssue(
        mimeType([], 'message'),
        { ...baseIssue, expected: 'never', requirement: [] },
        [
          new Blob(['foo'], { type: 'text/plain' }),
          new Blob(['foo'], { type: 'image/jpeg' }),
        ],
        (input) => `"${input.type}"`
      );
    });
  });
});
