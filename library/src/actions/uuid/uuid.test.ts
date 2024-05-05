import { describe, expect, test } from 'vitest';
import { UUID_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { uuid, type UuidAction, type UuidIssue } from './uuid.ts';

// TODO: Improve tests to cover all possible scenarios based on the regex used.

describe('uuid', () => {
  describe('should return action object', () => {
    const baseAction: Omit<UuidAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'uuid',
      reference: uuid,
      expects: null,
      requirement: UUID_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: UuidAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(uuid()).toStrictEqual(action);
      expect(uuid(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(uuid('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies UuidAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(uuid(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies UuidAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = uuid();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid UUIDv1', () => {
      expectNoActionIssue(action, [
        'a6021db4-0b07-11ef-9262-0242ac120002',
        'bf576dbe-0b07-11ef-9262-0242ac120002',
        'bf576fda-0b07-11ef-9262-0242ac120002',
        'bf577106-0b07-11ef-9262-0242ac120002',
        'bf57721e-0b07-11ef-9262-0242ac120002',
      ]);
    });

    test('for valid UUIDv4', () => {
      expectNoActionIssue(action, [
        'c1e12793-2e77-4611-874d-a4f9cc727e1e',
        '95d9d16b-feba-495d-ab7b-07e4212ff3d0',
        'c4322ec9-5c1f-4865-b0b1-52298acc5a8e',
        '6f66b7d5-8400-4e48-99f9-ae94ba418069',
        '779c2294-cb0a-4347-9587-61d4509d32db',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = uuid('message');
    const baseIssue: Omit<UuidIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'uuid',
      expected: null,
      message: 'message',
      requirement: UUID_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for invalid length UUIDs', () => {
      expectActionIssue(action, baseIssue, [
        'a6021db4-0b07-11ef-9262-0242ac1200020',
        '95d9d16b-feba-495d-ab7b-07e4212ff3d',
        '95d9d16b-feba-495d-ab7b',
      ]);
    });

    test('for invalid hyphenated UUIDs', () => {
      expectActionIssue(action, baseIssue, [
        'a6021db4-0b07-11ef-9262-0242ac120002-',
        '95d9d16b-feba-495d-ab7b--07e4212ff3d0',
        '95d9d16b--feba-495d-ab7b-07e4212ff3d0',
        '95d9d16b--feba--495d--ab7b--07e4212ff3d0',
      ]);
    });

    test('for invalid placed hyphens', () => {
      expectActionIssue(action, baseIssue, [
        'a6021db4-0b07-11ef-9262-0242ac120002-0',
        '95d9d16b-feba-495d-ab7b-07e4212ff3d-0',
        'c1e1279-32e77-4611-874d-a4f9cc727e1e',
      ]);
    });
  });
});
