import { describe, expect, test } from 'vitest';
import { ULID_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { ulid, type UlidAction, type UlidIssue } from './ulid.ts';

// TODO: Improve tests to cover all possible scenarios based on the regex used.

describe('ulid', () => {
  describe('should return action object', () => {
    const baseAction: Omit<UlidAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'ulid',
      reference: ulid,
      expects: null,
      requirement: ULID_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: UlidAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(ulid()).toStrictEqual(action);
      expect(ulid(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(ulid('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies UlidAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(ulid(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies UlidAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = ulid();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid ULIDs', () => {
      expectNoActionIssue(action, [
        '01ARZ3NDEKTSV4RRFFQ69G5FAV',
        '01BX5ZZKBKACTAV9WEVGEMMVRY',
      ]);
    });

    test('for case insensitive ULIDs', () => {
      expectNoActionIssue(action, [
        '01ARZ3NDEKTSV4RRFFQ69G5FAV',
        '01ARZ3NDEKTSV4RRFFQ69G5FAv',
        '01arz3ndektsv4rrffq69g5fav',
      ]);
    })
  });

  describe('should return dataset with issues', () => {
    const action = ulid('message');
    const baseIssue: Omit<UlidIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'ulid',
      expected: null,
      message: 'message',
      requirement: ULID_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for invalid length ULIDs', () => {
      expectActionIssue(action, baseIssue, [
        '01ARZ3NDEKTSV4RRFFQ69G5F',
        '1BX5ZZKBKACTAV9WEVGEMMVRZ',
        '01BX5ZZKBKACTAV9WEVGEMMVRY1',
        '01ARZ3NDEKTSV4RRFFQ69G5FAV12',
        '01ARZ3NDEKTSV4RRFFQ69G5FAV123',
      ]);
    });

    test('for non-Base32 occurrences in ULIDs', () => {
      expectActionIssue(action, baseIssue, [
        '01ARZ3NDEKTSV4RRFFQ69G5FAV-',
        '01ARZ3NDEKTSV4RRFFQ69G5FAV#',
        '01ARZ3NDE!KTSV4RRFFQ69G5FAV',
        '01ARZ3NDEKT*SV4RRFFQ69G5FAV',
      ]);
    });
  });
});
