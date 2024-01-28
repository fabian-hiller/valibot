import { afterEach, describe, expect, test } from 'vitest';
import { setGlobalMessage, setLocalMessage } from '../../storages/index.ts';
import type { SchemaIssue } from '../../types/index.ts';
import { i18n } from './i18n.ts';

describe('i18n', () => {
  const issue: SchemaIssue = {
    reason: 'string',
    validation: 'min_length',
    origin: 'value',
    expected: '>=10',
    received: '5',
    message: 'Invalid length',
    input: 'hello',
    requirement: 10,
  };

  const key = 'key';
  const contextMessage = 'context message';
  const configMessage = 'config message';
  const localMessage = 'local message';
  const globalMessage = 'global message';

  afterEach(() => {
    setGlobalMessage(undefined);
    setLocalMessage(key, undefined);
  });

  test('should return context message', () => {
    setGlobalMessage(globalMessage);
    setLocalMessage(key, localMessage);
    expect(
      i18n(
        { type: key, message: contextMessage },
        { message: configMessage },
        issue
      )
    ).toBe(contextMessage);

    setGlobalMessage(() => globalMessage);
    setLocalMessage(key, () => localMessage);
    expect(
      i18n(
        { type: key, message: () => contextMessage },
        { message: () => configMessage },
        issue
      )
    ).toBe(contextMessage);
  });

  test('should return config message', () => {
    setGlobalMessage(globalMessage);
    setLocalMessage(key, localMessage);
    expect(
      i18n({ type: key, message: undefined }, { message: configMessage }, issue)
    ).toBe(configMessage);

    setGlobalMessage(() => globalMessage);
    setLocalMessage(key, () => localMessage);
    expect(
      i18n(
        { type: key, message: undefined },
        { message: () => configMessage },
        issue
      )
    ).toBe(configMessage);
  });

  test('should return local message', () => {
    setGlobalMessage(globalMessage);
    setLocalMessage(key, localMessage);
    expect(
      i18n({ type: key, message: undefined }, { message: undefined }, issue)
    ).toBe(localMessage);

    setGlobalMessage(() => globalMessage);
    setLocalMessage(key, () => localMessage);
    expect(
      i18n({ type: key, message: undefined }, { message: undefined }, issue)
    ).toBe(localMessage);
  });

  test('should return global message', () => {
    setGlobalMessage(globalMessage);
    expect(
      i18n({ type: key, message: undefined }, { message: undefined }, issue)
    ).toBe(globalMessage);

    setGlobalMessage(() => globalMessage);
    expect(
      i18n({ type: key, message: undefined }, { message: undefined }, issue)
    ).toBe(globalMessage);
  });

  test('should return fallback message', () => {
    expect(
      i18n({ type: key, message: undefined }, { message: undefined }, issue)
    ).toBe(issue.message);
  });
});
