import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { maxSize, type MaxSizeAction, type MaxSizeIssue } from './maxSize.ts';

describe('maxSize', () => {
  describe('should return action object', () => {
    const baseAction: Omit<MaxSizeAction<Blob, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'max_size',
      expects: '<=5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MaxSizeAction<Blob, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(maxSize(5)).toStrictEqual(action);
      expect(maxSize(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(maxSize(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MaxSizeAction<Blob, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(maxSize(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MaxSizeAction<Blob, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = maxSize(3);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid maps', () => {
      expectNoActionIssue(action, [
        new Map(),
        new Map([[1, null]]),
        new Map<string | number, string>([
          [1, 'one'],
          ['2', 'two'],
        ]),
        new Map<string | number | boolean, string | null>([
          ['1', 'one'],
          [2, null],
          [true, null],
        ]),
      ]);
    });

    test('for valid sets', () => {
      expectNoActionIssue(action, [
        new Set(),
        new Set([1]),
        new Set([1, '2']),
        new Set(['1', 2, { value: 3 }]),
      ]);
    });

    test('for valid blobs', () => {
      expectNoActionIssue(action, [
        new Blob([], { type: 'text/plain' }),
        new Blob([new Blob(['hi'], { type: 'text/plain' })], {
          type: 'text/plain',
        }),
        new Blob(
          [new Uint8Array([72, 101]), new Blob(['!'], { type: 'text/plain' })],
          { type: 'text/plain' }
        ),
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = maxSize(3, 'message');
    const baseIssue: Omit<
      MaxSizeIssue<Map<number, string>, 3>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'max_size',
      expected: '<=3',
      message: 'message',
      requirement: 3,
    };

    test('for invalid maps', () => {
      expectActionIssue(
        action,
        baseIssue,
        [
          new Map([
            [1, 'one'],
            [2, 'two'],
            [3, 'three'],
            [4, 'four'],
          ]),
          new Map<number | string | boolean, string | null>([
            [1, 'one'],
            ['2', null],
            [true, null],
            [4, 'four'],
          ]),
        ],
        (value) => `${value.size}`
      );
    });

    test('for invalid sets', () => {
      expectActionIssue(
        action,
        baseIssue,
        [new Set([1, 2, 3, 4]), new Set([1, null, '3', true])],
        (value) => `${value.size}`
      );
    });

    test('for invalid blobs', () => {
      expectActionIssue(
        action,
        baseIssue,
        [
          new Blob(['hello'], { type: 'text/plain' }),
          new Blob([new Blob(['hello'], { type: 'text/plain' })], {
            type: 'text/plain',
          }),
          new Blob(
            [new Uint8Array([72, 101, 108, 108, 111])], // 'hello' in base 10 number system
            { type: 'text/plain' }
          ),
        ],
        (value) => `${value.size}`
      );
    });
  });
});
