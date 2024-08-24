import { describe, expect, test } from 'vitest';
import { NANO_ID_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { nanoid, type NanoIDAction, type NanoIDIssue } from './nanoid.ts';

describe('nanoid', () => {
  describe('should return action object', () => {
    const baseAction: Omit<NanoIDAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'nanoid',
      reference: nanoid,
      expects: null,
      requirement: NANO_ID_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: NanoIDAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(nanoid()).toStrictEqual(action);
      expect(nanoid(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(nanoid('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies NanoIDAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(nanoid(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies NanoIDAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = nanoid();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for with _ and - symbols', () => {
      expectNoActionIssue(action, [
        'OIjC22zGKp_rrTYQBb3xt',
        '8hiQ-95aV5qCnB4x0rPBu',
        'aIojG8uVOE0-1ANOZLugU',
      ]);
    });

    test('for alphabets and numerals only', () => {
      expectNoActionIssue(action, [
        '4EdTtQZCc5GIFA9ABjEsQ',
        'ODz0tL5pgbQvpbptus6LL',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = nanoid('message');
    const baseIssue: Omit<NanoIDIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'nanoid',
      expected: null,
      message: 'message',
      requirement: NANO_ID_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for string with spaces', () => {
      expectActionIssue(action, baseIssue, [
        'BImGM 7USGakXaVhydHgO',
        'LBjowKnkbk95kK3IoUV7 ',
        ' vM7SGqVFmPS5tw7fII-G',
      ]);
    });

    test('for special chars', () => {
      expectActionIssue(action, baseIssue, [
        '@1o5BK76uGc-mbqeprAvX',
        '#Lcb2qbTsjS98y9Vf-G15',
        '$3WZ4tXxsuiDBezXIJKlP',
        '%gSjBHLFDO67bE-nbgBRi',
        '&2zYmqr0APdImhdxC69t4',
      ]);
    });
  });
});
