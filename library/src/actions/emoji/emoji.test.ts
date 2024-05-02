import { describe, expect, test } from 'vitest';
import { EMOJI_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { emoji, type EmojiAction, type EmojiIssue } from './emoji.ts';

describe('emoji', () => {
  describe('should return action object', () => {
    const baseAction: Omit<EmojiAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'emoji',
      reference: emoji,
      expects: null,
      requirement: EMOJI_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: EmojiAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(emoji()).toStrictEqual(action);
      expect(emoji(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(emoji('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies EmojiAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(emoji(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies EmojiAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = emoji();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for emoji chars (not exhaustive)', () => {
      expectNoActionIssue(action, [
        '🤖',
        '\uD83D\uDE0D', // surrogate pair of - 😍
        '🔥',
        '💯',
        '#',
        '*',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
      ]);
    });

    test('for two chars', () => {
      expectNoActionIssue(action, [
        '1🤖',
        '🤖#',
        '🤖\uD83D\uDE0D',
        '*#',
        '#1',
        '1*2',
      ]);
    });

    test('for multiple chars', () => {
      expectNoActionIssue(action, [
        '0123456789',
        '0123456789*#',
        '🤖\uD83D\uDE0D🔥💯',
        '🤖😍🔥💯',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = emoji('message');
    const baseIssue: Omit<EmojiIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'emoji',
      expected: null,
      message: 'message',
      requirement: EMOJI_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ']);
    });

    test('for blank spaces', () => {
      expectActionIssue(action, baseIssue, [' 🤖', '🤖 ', ' 🤖 ', '🤖 😍']);
    });

    test('for number signs', () => {
      expectActionIssue(action, baseIssue, ['+1', '-1', '+123', '-123']);
    });

    test('for float numbers', () => {
      expectActionIssue(action, baseIssue, ['0.1', '123.456']);
    });

    test('for exponential numbers', () => {
      expectActionIssue(action, baseIssue, ['1e-3', '1e+3']);
    });

    test('for special characters', () => {
      expectActionIssue(action, baseIssue, [
        '\n',
        '\t',
        '\r',
        '\\',
        '\v',
        '\f',
        '\b',
        '\r\n',
        '\t\t\n',
      ]);
    });

    test('for composite characters', () => {
      expectActionIssue(action, baseIssue, [
        'S\u0307', // Ṡ
        'S\u0307\u0323', // Ṩ
        '\u1e68', // Ṩ
      ]);
    });

    test('for invalid symbols (not exhaustive)', () => {
      expectActionIssue(action, baseIssue, [
        '~',
        '`',
        '!',
        '@',
        '$',
        '%',
        '^',
        '&',
        '-',
        '+',
        '(',
        ')',
        '/',
        '@#',
        '&&',
        '||',
        '!!',
        '@#$',
      ]);
    });

    test('for emojis with invalid characters', () => {
      expectActionIssue(action, baseIssue, [
        'emoji😀',
        '😀emoji',
        '😀hi👋🏼',
        '@👋🏼',
        '👋🏼@',
        '👋🏼@👋🏼',
      ]);
    });

    test('for invalid codepoints', () => {
      expectActionIssue(action, baseIssue, [
        '\uD83D', // First part of the surrogate pair that represents - 😀
        '\uD83D👋🏼',
        '👋🏼\uD83D',
        '\uDE00', // Second part of the surrogate pair that represents - 😀
        '\uDE00👋🏼',
        '👋🏼\uDE00',
        '\uDE00\uD83D', // Reverse of the surrogate pair that respresents - 😀
        '\uDE00\uD83D👋🏼',
        '👋🏼\uDE00\uD83D',
      ]);
    });
  });
});
