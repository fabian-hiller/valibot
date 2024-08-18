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

    test('for default ID length', () => {
      expectNoActionIssue(action, [
        'OIjC22zGKp_rrTYQBb3xt',
        '4EdTtQZCc5GIFA9ABjEsQ',
        '8hiQ-95aV5qCnB4x0rPBu',
        'aIojG8uVOE0-1ANOZLugU',
        'ODz0tL5pgbQvpbptus6LL',
      ]);
    });

    test('for 36 characters ID length', () => {
      expectNoActionIssue(action, [
        'GnNK4jChVqRzfS3D1tKlK1gyBFHet40wRME0',
        'yKzhkwFV6MorFYCWvfrEra_cl2_C9AJVnr-P',
        'wGGeRInEDWjHjyJF0jJBnYcxmdOW0yghjL_N',
        'ER5WiemGh-BCwKfbqwa-dwzesKCALiti_kgn',
        '3Pnm_UOzO-9JgSc82cvqVw8pdq3wXCEcRVDM',
      ]);
    });

    test('for 2 characters ID length', () => {
      expectNoActionIssue(action, ['cf', 'Ka', '7G', 'gx', 'VS']);
    });

    test('for hyphens and underscores', () => {
      expectNoActionIssue(action, ['_40', '-8K', 'Y-z', 'uI_', 'Mk-']);
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
        'TvVHTtJLv4 kMeb_tDipeg',
        ' rqer3NNc7F6ZIIcZjabce',
        '0-3_fzh-XNFlwL6JR95GT ',
      ]);
    });

    test('for not between 2 to 36 characters', () => {
      expectActionIssue(action, baseIssue, [
        'F',
        'carpyVLA_Lb2H-C3fEhPwhn5w7bbZA-KzSdRG3vMe',
      ]);
    });

    test('for special chars', () => {
      expectActionIssue(action, baseIssue, [
        '@1o5BK76uGc-mbqeprAvXc',
        '#Lcb2qbTsjS98y9Vf-G15k',
        '$3WZ4tXxsuiDBezXIJKlPu',
        '%gSjBHLFDO67bE-nbgBRiO',
        '&2zYmqr0APdImhdxC69t4_',
      ]);
    });
  });
});
