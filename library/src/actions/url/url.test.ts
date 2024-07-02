import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { url, type UrlAction, type UrlIssue } from './url.ts';

describe('url', () => {
  describe('should return action object', () => {
    const baseAction: Omit<UrlAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'url',
      reference: url,
      expects: null,
      requirement: expect.any(Function),
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: UrlAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(url()).toStrictEqual(action);
      expect(url(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(url('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies UrlAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(url(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies UrlAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = url();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for a HTTP URL', () => {
      expectNoActionIssue(action, [
        'http://example.com',
        'http://www.example.com/path',
        'http://subdomain1.subdomain2.example.com/path1/path2?param1=value1&param2=value2',
      ]);
    });

    test('for a HTTPS URL', () => {
      expectNoActionIssue(action, [
        'https://example.com',
        'https://www.example.com/path',
        'https://subdomain1.subdomain2.example.com/path1/path2?param1=value1&param2=value2',
      ]);
    });

    test('for a FTP URL', () => {
      expectNoActionIssue(action, [
        'ftp://example.com',
        'ftp://www.example.com/path',
        'ftp://subdomain1.subdomain2.example.com/path1/path2?param1=value1&param2=value2',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = url('message');
    const baseIssue: Omit<UrlIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'url',
      expected: null,
      message: 'message',
      requirement: expect.any(Function),
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for URL without scheme', () => {
      expectActionIssue(action, baseIssue, [
        'example.com',
        'www.example.com/path',
        'subdomain1.subdomain2.example.com/path1/path2?param1=value1&param2=value2',
      ]);
    });
  });
});
