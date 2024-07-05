import { describe, expect, test } from 'vitest';
import { normalize, type NormalizeAction } from './normalize.ts';

describe('normalize', () => {
  describe('should return action object', () => {
    const baseAction: Omit<NormalizeAction<never>, 'form'> = {
      kind: 'transformation',
      type: 'normalize',
      reference: normalize,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined form', () => {
      expect(normalize()).toStrictEqual({
        ...baseAction,
        form: undefined,
      } satisfies NormalizeAction<undefined>);
    });

    test('with defined form', () => {
      expect(normalize('NFKD')).toStrictEqual({
        ...baseAction,
        form: 'NFKD',
      } satisfies NormalizeAction<'NFKD'>);
    });
  });

  describe('should normalize string', () => {
    test('with undefined form', () => {
      expect(
        normalize()._run({ typed: true, value: '\u00F1' }, {})
      ).toStrictEqual({
        typed: true,
        value: 'ñ',
      });
      expect(
        normalize()._run({ typed: true, value: '\u006E\u0303' }, {})
      ).toStrictEqual({
        typed: true,
        value: 'ñ',
      });
    });

    test('with defined form', () => {
      expect(
        normalize('NFKD')._run({ typed: true, value: '\uFB00' }, {})
      ).toStrictEqual({
        typed: true,
        value: 'ff',
      });
      expect(
        normalize('NFKD')._run({ typed: true, value: '\u0066\u0066' }, {})
      ).toStrictEqual({
        typed: true,
        value: 'ff',
      });
    });
  });
});
