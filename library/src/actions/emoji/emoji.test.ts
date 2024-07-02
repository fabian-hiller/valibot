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
        '🙂',
        '🤖',
        '\uD83D\uDE0D', // 😍
        '🔥',
        '💯',
        '2️⃣',
        '🔟',
        '🇺🇸',
        '👋🏼',
        '🫨',
      ]);
    });

    test('for two chars', () => {
      expectNoActionIssue(action, [
        '🙂🤖',
        '\uD83D\uDE0D🔥', // 😍🔥
        '2️⃣🔟',
        '🇺🇸👋🏼',
      ]);
    });

    test('for multiple chars', () => {
      expectNoActionIssue(action, [
        '🧩🙌🏁💅🎬',
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
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for blank spaces', () => {
      expectActionIssue(action, baseIssue, [' 🤖', '🤖 ', ' 🤖 ', '🤖 😍']);
    });

    test('for word chars', () => {
      expectActionIssue(action, baseIssue, [
        'emoji',
        '😀emoji',
        'emoji😀',
        'hi',
        'hi👋🏼',
        '👋🏼hi',
      ]);
    });

    // TODO: This test needs to be enabled after upgrading the emoji regex.
    // See the comment in `regex.ts` for more details.
    // test('for numbers', () => {
    //   expectActionIssue(action, baseIssue, [
    //     '0',
    //     '1',
    //     '2',
    //     '3',
    //     '4',
    //     '5',
    //     '6',
    //     '7',
    //     '8',
    //     '9',
    //     '0123456789',
    //   ]);
    // });

    test('for special chars', () => {
      expectActionIssue(action, baseIssue, [
        // TODO: These chars needs to be enabled after upgrading the emoji regex.
        // See the comment in `regex.ts` for more details.
        // '#',
        // '*',
        '!',
        '@',
        '$',
        '%',
        '^',
        '&',
        '-',
        '+',
        '~',
      ]);
    });

    test('for escape chars', () => {
      expectActionIssue(action, baseIssue, [
        '\n',
        '\t',
        '\r',
        '\\',
        '\v',
        '\f',
        '\b',
      ]);
    });

    test('for composite chars', () => {
      expectActionIssue(action, baseIssue, [
        'S\u0307', // Ṡ
        'S\u0307\u0323', // Ṩ
        '\u1e68', // Ṩ
      ]);
    });

    test('for wrong emoji parts', () => {
      expectActionIssue(action, baseIssue, [
        '\uD83D', // First part of 😍
        '\uDE0D', // Second part of 😍
        '\uDE0D\uD83D', // Twisted parts of 😍
      ]);
    });
  });
});
