import { afterEach, describe, expect, test } from 'vitest';
import { string } from '../../schemas/index.ts';
import {
  deleteGlobalMessage,
  deleteSchemaMessage,
  deleteSpecificMessage,
  setGlobalMessage,
  setSchemaMessage,
  setSpecificMessage,
} from '../../storages/index.ts';
import type { SchemaIssue } from '../../types/index.ts';
import { i18n } from './i18n.ts';

describe('i18n', () => {
  const reference = string;

  const contextMessage = 'context message';
  const configMessage = 'config message';
  const specificMessage = 'specific message';
  const schemaMessage = 'schema message';
  const globalMessage = 'global message';

  const issue: SchemaIssue = {
    reason: 'type',
    context: 'string',
    expected: 'string',
    received: '123',
    message: 'Invalid type: Expected string but received 123',
    input: 123,
  };

  afterEach(() => {
    deleteGlobalMessage();
    deleteSchemaMessage();
    deleteSpecificMessage(reference);
  });

  test('should return context message', () => {
    setSpecificMessage(reference, specificMessage);
    setSchemaMessage(schemaMessage);
    setGlobalMessage(globalMessage);
    expect(
      i18n(
        true,
        { message: contextMessage },
        reference,
        { message: configMessage },
        issue
      )
    ).toBe(contextMessage);

    setSpecificMessage(reference, () => specificMessage);
    setSchemaMessage(() => schemaMessage);
    setGlobalMessage(() => globalMessage);
    expect(
      i18n(
        true,
        { message: () => contextMessage },
        reference,
        { message: () => configMessage },
        issue
      )
    ).toBe(contextMessage);
  });

  test('should return specific message', () => {
    setSpecificMessage(reference, specificMessage);
    setSchemaMessage(schemaMessage);
    setGlobalMessage(globalMessage);
    expect(
      i18n(
        true,
        { message: undefined },
        reference,
        { message: configMessage },
        issue
      )
    ).toBe(specificMessage);

    setSpecificMessage(reference, () => specificMessage);
    setSchemaMessage(() => schemaMessage);
    setGlobalMessage(() => globalMessage);
    expect(
      i18n(
        true,
        { message: undefined },
        reference,
        { message: () => configMessage },
        issue
      )
    ).toBe(specificMessage);
  });

  test('should return schema message', () => {
    setSchemaMessage(schemaMessage);
    setGlobalMessage(globalMessage);
    expect(
      i18n(
        true,
        { message: undefined },
        reference,
        { message: configMessage },
        issue
      )
    ).toBe(schemaMessage);

    setSchemaMessage(() => schemaMessage);
    setGlobalMessage(() => globalMessage);
    expect(
      i18n(
        true,
        { message: undefined },
        reference,
        { message: () => configMessage },
        issue
      )
    ).toBe(schemaMessage);
  });

  test('should not return schema message', () => {
    setSchemaMessage(schemaMessage);
    setGlobalMessage(globalMessage);
    expect(
      i18n(
        false,
        { message: undefined },
        reference,
        { message: configMessage },
        issue
      )
    ).not.toBe(schemaMessage);

    setSchemaMessage(() => schemaMessage);
    setGlobalMessage(() => globalMessage);
    expect(
      i18n(
        false,
        { message: undefined },
        reference,
        { message: () => configMessage },
        issue
      )
    ).not.toBe(schemaMessage);
  });

  test('should return config message', () => {
    setGlobalMessage(globalMessage);
    expect(
      i18n(
        true,
        { message: undefined },
        reference,
        { message: configMessage },
        issue
      )
    ).toBe(configMessage);

    setGlobalMessage(() => globalMessage);
    expect(
      i18n(
        true,
        { message: undefined },
        reference,
        { message: () => configMessage },
        issue
      )
    ).toBe(configMessage);
  });

  test('should return global message', () => {
    setGlobalMessage(globalMessage);
    expect(
      i18n(
        true,
        { message: undefined },
        reference,
        { message: undefined },
        issue
      )
    ).toBe(globalMessage);

    setGlobalMessage(() => globalMessage);
    expect(
      i18n(
        true,
        { message: undefined },
        reference,
        { message: undefined },
        issue
      )
    ).toBe(globalMessage);
  });

  test('should return issue message', () => {
    expect(
      i18n(
        true,
        { message: undefined },
        reference,
        { message: undefined },
        issue
      )
    ).toBe(issue.message);

    expect(
      i18n(
        true,
        { message: undefined },
        reference,
        { message: undefined },
        issue
      )
    ).toBe(issue.message);
  });
});
