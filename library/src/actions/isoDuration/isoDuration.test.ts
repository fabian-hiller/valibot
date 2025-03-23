import { describe, expect, test } from 'vitest';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue } from '../../vitest/expectActionIssue.ts';
import { expectNoActionIssue } from '../../vitest/expectNoActionIssue.ts';
import { isoDuration, type IsoDurationAction, type IsoDurationIssue } from './isoDuration.ts';
import { isISO8601Duration } from './isISO8601Duration.ts';

describe('isoDuration', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IsoDurationAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'iso_duration',
      reference: isoDuration,
      expects: null,
      requirement: isISO8601Duration,
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IsoDurationAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(isoDuration()).toStrictEqual(action);
      expect(isoDuration(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(isoDuration('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies IsoDurationAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(isoDuration(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IsoDurationAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = isoDuration();

    test('for untyped inputs', () => {
      const issues: [StringIssue] = [
        {
          kind: 'schema',
          type: 'string',
          input: null,
          expected: 'string',
          received: 'null',
          message: 'message',
        },
      ];
      expect(
        action['~run']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues,
      });
    });

    test('for valid ISO Durations', () => {
      expectNoActionIssue(action, [
        'P1Y',
        'P3M',
        'P2W',
        'P5D',
        'PT8H',
        'PT30M',
        'PT10S',
        'P1Y6M',
        'P3Y4M2D',
        'P2DT12H',
        'PT1H30M',
        'PT1H30M45S',
        'P1Y2M3DT4H5M6S',
        'P0Y0M0DT0H0M0S',
        'PT0S',
        'P1Y0M',
        'P0Y3M',
        'P10Y',
        'PT36H',
        'PT0.5S',
        'PT1,5H',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = isoDuration('message');
    const baseIssue: Omit<IsoDurationIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'iso_duration',
      expected: null,
      message: 'message',
      requirement: isISO8601Duration,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for missing prefix', () => {
      expectActionIssue(action, baseIssue, [
        '1Y2M',
        'T30M',
        '5D3H',
        '3Y6M2DT12H30M'
      ]);
    });

    test('for invalid order', () => {
      expectActionIssue(action, baseIssue, [
        'P1M2Y',
        'PT30S15M',
        'P3D2M1Y'
      ]);
    });

    test('for missing T separator', () => {
      expectActionIssue(action, baseIssue, [
        'P1Y2M3D4H5M6S',
        'P5D10H',
        'P10Y3M5D1H'
      ]);
    });

    test('for duplicate designators', () => {
      expectActionIssue(action, baseIssue, [
        'P1Y2Y3M',
        'PT5H6H',
        'P1Y2M3D4Q',
        'P1Y2MT3HZ',
      ]);
    });

    test('for mix-matching with W designator', () => {
      expectActionIssue(action, baseIssue, [
        'P1Y2Y3M1W',
        'P3WT5H6H'
      ]);
    });

    test('for mix-matching , and .', () => {
      expectActionIssue(action, baseIssue, [
        'P1.1Y2Y3MT2.5D',
        'P1,5YT5.1S'
      ]);
    });
  });
});
