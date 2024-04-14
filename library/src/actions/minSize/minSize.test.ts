import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { minSize, type MinSizeAction, type MinSizeIssue } from './minSize.ts';

describe('minSize', () => {
  describe('should return action object', () => {
    const baseAction: Omit<MinSizeAction<Blob, 5, never>, 'message'> = {
      kind: 'validation',
      type: 'min_size',
      expects: '>=5',
      requirement: 5,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MinSizeAction<Blob, 5, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(minSize(5)).toStrictEqual(action);
      expect(minSize(5, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(minSize(5, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MinSizeAction<Blob, 5, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(minSize(5, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MinSizeAction<Blob, 5, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = minSize(3);

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid maps', () => {
      expectNoActionIssue(action, [
        new Map([
          [1, 'one'],
          [2, 'two'],
          [3, 'three'],
        ]),
        new Map<string | number, string>([
          [1, 'one'],
          ['2', 'two'],
          [3, 'three'],
          [4, 'four'],
        ]),
        new Map<string | number | boolean, string | null>([
          ['1', 'one'],
          [2, null],
          [true, null],
          [4, 'four'],
          [5, 'five'],
        ]),
      ]);
    });

    test('for valid sets', () => {
      expectNoActionIssue(action, [
        new Set([1, 2, 3]),
        new Set([1, 'two', null, '4']),
        new Set(['1', 2, 'three', null, { value: '5' }]),
      ]);
    });

    test('for valid blobs', () => {
      expectNoActionIssue(action, [
        new Blob(['123']),
        new Blob(['1', '2', '3'], { type: 'text/plain' }),
        new Blob(
          [
            new Uint8Array([72, 101, 108, 108, 111]), // 'Hello'
            new Blob(['!'], { type: 'text/plain' }),
          ],
          { type: 'text/plain' }
        ),
        new Blob(['foobarbaz123']),
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = minSize(3, 'message');
    const baseIssue: Omit<
      MinSizeIssue<Map<number, string>, 3>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'min_size',
      expected: '>=3',
      message: 'message',
      requirement: 3,
    };

    test('for invalid maps', () => {
      expectActionIssue(
        action,
        baseIssue,
        [
          new Map(),
          new Map([[1, 'one']]),
          new Map([
            ['one', 1],
            ['two', 2],
          ]),
        ],
        (value) => `${value.size}`
      );
    });

    test('for invalid sets', () => {
      expectActionIssue(
        action,
        baseIssue,
        [new Set(), new Set([1]), new Set(['one', null])],
        (value) => `${value.size}`
      );
    });

    test('for invalid blobs', () => {
      expectActionIssue(
        action,
        baseIssue,
        [
          new Blob([]),
          new Blob(['1']),
          new Blob(['hi'], { type: 'text/plain' }),
          new Blob([new Uint8Array([72, 105])]), // 'Hi'
        ],
        (value) => `${value.size}`
      );
    });
  });
});
