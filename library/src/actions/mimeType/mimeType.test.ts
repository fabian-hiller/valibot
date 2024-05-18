import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  mimeType,
  type MimeTypeAction,
  type MimeTypeIssue,
} from './mimeType.ts';

describe('mimeType', () => {
  describe('should return action object', () => {
    const baseAction: Omit<
      MimeTypeAction<Blob, ['image/jpeg', 'image/png'], never>,
      'message'
    > = {
      kind: 'validation',
      type: 'mime_type',
      reference: mimeType,
      expects: '"image/jpeg" | "image/png"',
      requirement: ['image/jpeg', 'image/png'],
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MimeTypeAction<
        Blob,
        ['image/jpeg', 'image/png'],
        undefined
      > = {
        ...baseAction,
        message: undefined,
      };
      expect(
        mimeType<Blob, ['image/jpeg', 'image/png']>(['image/jpeg', 'image/png'])
      ).toStrictEqual(action);
      expect(
        mimeType<Blob, ['image/jpeg', 'image/png'], undefined>(
          ['image/jpeg', 'image/png'],
          undefined
        )
      ).toStrictEqual(action);
    });

    test('with string message', () => {
      const message = 'message';
      expect(
        mimeType<Blob, ['image/jpeg', 'image/png'], 'message'>(
          ['image/jpeg', 'image/png'],
          message
        )
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MimeTypeAction<Blob, ['image/jpeg', 'image/png'], 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(
        mimeType<Blob, ['image/jpeg', 'image/png'], typeof message>(
          ['image/jpeg', 'image/png'],
          message
        )
      ).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MimeTypeAction<
        Blob,
        ['image/jpeg', 'image/png'],
        typeof message
      >);
    });
  });

  describe('should return dataset without issues', () => {
    test('for untyped inputs', () => {
      expect(
        mimeType(['image/jpeg', 'image/png'])._run(
          { typed: false, value: null },
          {}
        )
      ).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid inputs of MIME types without parameter', () => {
      expectNoActionIssue(mimeType(['text/plain']), [
        new Blob(['valibot'], { type: 'text/plain' }),
        new Blob(['Library'], { type: 'Text/plain' }),
        new Blob(['VALIDATE'], { type: 'TEXT/plain' }),
        new Blob(['data'], { type: 'text/Plain' }),
        new Blob(
          [new Uint8Array([72, 101, 108, 108, 111])], // 'Hello'
          { type: 'text/plain' }
        ),
        new File(['hi'], 'someFileName.txt', { type: 'text/plain' }),
      ]);

      expectNoActionIssue(mimeType(['image/png', 'video/mp4']), [
        new File(['foo1'], 'foo1.png', { type: 'image/png' }),
        new File(['foo2'], 'foo2.png', { type: 'IMAGE/png' }),
        new File(['foo3'], 'foo3.png', { type: 'image/Png' }),
        new File(['bar'], 'bar.mp4', { type: 'video/mp4' }),
      ]);
    });

    test('for valid inputs of MIME types with parameter', () => {
      expectNoActionIssue(mimeType(['text/plain;charset=us-ascii']), [
        new Blob(
          [new Uint8Array([86, 97, 108, 105, 98, 111, 116])], // Valibot
          { type: 'text/plain;charset=us-ascii' }
        ),
        new File(
          [
            new Uint8Array([
              71, 111, 111, 100, 32, 109, 111, 114, 110, 105, 110, 103,
            ]), // Good morning
          ],
          'message.txt',
          { type: 'text/plain;charset=us-ascii' }
        ),
      ]);

      expectNoActionIssue(
        mimeType(['application/json;charset=utf-16', 'text/css;charset=utf-8']),
        [
          new Blob([], { type: 'application/json;CHARSET=utf-16' }),
          new Blob(
            [
              new Uint16Array(
                [
                  123, 34, 101, 109, 111, 106, 105, 34, 58, 34, 55358, 56598,
                  34, 125,
                ] // {"emoji":"🤖"}
              ),
            ],
            { type: 'application/json;charset=utf-16' }
          ),
          new File(
            [
              new Uint8Array([
                46, 104, 105, 100, 100, 101, 110, 123, 100, 105, 115, 112, 108,
                97, 121, 58, 110, 111, 110, 101, 59, 125,
              ]), // .hidden{display:none;}
            ],
            'utils.css',
            { type: 'text/css;charset=utf-8' }
          ),
        ]
      );
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<
      MimeTypeIssue<Blob, never>,
      'input' | 'received' | 'expected' | 'requirement'
    > = {
      kind: 'validation',
      type: 'mime_type',
      message: 'message',
    };

    test('for invalid inputs of MIME types without parameter', () => {
      expectActionIssue(
        mimeType(['text/plain'], 'message'),
        {
          ...baseIssue,
          expected: '"text/plain"',
          requirement: ['text/plain'],
        },
        [
          new Blob([], { type: 'text/html' }),
          new File([], 'index.css', { type: 'text/css' }),
          new File(['foo'], 'foo.png', { type: 'image/png' }),
        ]
      );

      expectActionIssue(
        mimeType(['text/javascript', 'image/jpeg'], 'message'),
        {
          ...baseIssue,
          expected: '"text/javascript" | "image/jpeg"',
          requirement: ['text/javascript', 'image/jpeg'],
        },
        [
          new Blob([], { type: 'text/plain' }),
          new File([], 'data.txt', { type: 'text/plain' }),
          new File(['foo'], 'foo.png', { type: 'image/png' }),
        ]
      );
    });

    test('for invalid inputs of MIME types with parameter', () => {
      expectActionIssue(
        mimeType(['text/plain;charset=us-ascii'], 'message'),
        {
          ...baseIssue,
          expected: '"text/plain;charset=us-ascii"',
          requirement: ['text/plain;charset=us-ascii'],
        },
        [
          new Blob([], { type: 'text/plain' }),
          new Blob(
            [
              new Uint16Array([
                86, 97, 108, 105, 98, 111, 116, 32, 55357, 56845,
              ]),
            ], // Valibot 😍
            { type: 'text/plain;charset=utf-16' }
          ),
          new File(
            [
              new Uint8Array([
                71, 111, 111, 100, 32, 101, 118, 101, 110, 105, 110, 103,
              ]), // Good evening
            ],
            'message.txt',
            { type: 'text/plain;charset=utf-8' }
          ),
        ]
      );

      expectActionIssue(
        mimeType(
          ['application/json;charset=utf-16', 'text/css;charset=utf-8'],
          'message'
        ),
        {
          ...baseIssue,
          expected:
            '"application/json;charset=utf-16" | "text/css;charset=utf-8"',
          requirement: [
            'application/json;charset=utf-16',
            'text/css;charset=utf-8',
          ],
        },
        [
          new Blob([], { type: 'application/json' }),
          new Blob(
            [
              new Uint8Array(
                [
                  123, 34, 101, 109, 111, 106, 105, 34, 58, 34, 240, 159, 164,
                  150, 34, 125,
                ] // {"emoji":"🤖"}
              ),
            ],
            { type: 'application/json;charset=utf-8' }
          ),
          new File(
            [
              new Uint16Array([
                112, 58, 58, 98, 101, 102, 111, 114, 101, 123, 99, 111, 110,
                116, 101, 110, 116, 58, 34, 55357, 56490, 34, 59, 125,
              ]), // p::before{content:"💪";}
            ],
            'index.css',
            { type: 'text/css;charset=utf-16' }
          ),
        ]
      );
    });
  });
});
