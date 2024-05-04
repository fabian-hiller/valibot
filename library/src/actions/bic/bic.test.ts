import { describe, expect, test } from 'vitest';
import { BIC_REGEX } from '../../regex.ts';
import { expectActionIssue } from '../../vitest/expectActionIssue.ts';
import { expectNoActionIssue } from '../../vitest/expectNoActionIssue.ts';
import type { BicIssue } from './bic.ts';
import { bic, type BicAction } from './bic.ts';

describe('bic', () => {
  describe('should return action object', () => {
    const baseAction: Omit<BicAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'bic',
      reference: bic,
      expects: null,
      requirement: BIC_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: BicAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(bic()).toStrictEqual(action);
      expect(bic(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(bic('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies BicAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(bic(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies BicAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = bic();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid BICs', () => {
      expectNoActionIssue(action, [
        'DEUTDEFF',
        'DEUTDEFF400',
        'NEDSZAJJXXX',
        'MLCOUS33',
        'EBATFRPPEB1',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = bic('message');
    const baseIssue: Omit<BicIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'bic',
      expected: null,
      message: 'message',
      requirement: BIC_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for lowercase letters', () => {
      expectActionIssue(action, baseIssue, [
        'deutdeff',
        'DEUtDEFF400',
        'nEDSZAJJXXX',
        'MLcouS33',
        'EBATFRPPEb1',
      ]);
    });

    test('for digit in first 6 chars', () => {
      expectActionIssue(action, baseIssue, [
        'DE8TDEFF',
        '3EUTDEFF400',
        'NEDSZ8JJXXX',
        'M2COUS33',
        'EBAT4RPPEB1',
      ]);
    });

    test('for too short BICs', () => {
      expectActionIssue(action, baseIssue, ['DEUTDEF', 'MLCOUS']);
    });

    test('for too long BICs', () => {
      expectActionIssue(action, baseIssue, [
        'DEUTDEFF4000',
        'NEDSZAJJXXXX',
        'EBATFRPPEB123',
      ]);
    });

    test('for test BICs', () => {
      expectActionIssue(action, baseIssue, ['DEUTDE00', 'NEDSZA00XXX']);
    });

    test('for special chars', () => {
      expectActionIssue(action, baseIssue, [
        'DEU@DEFF',
        'DEUTDEFF$00',
        'NEDSZAJJXX%',
        'MLCOU€33',
        'EB#TFRPPEB1',
      ]);
    });
  });
});
