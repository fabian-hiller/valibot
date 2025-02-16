import { describe, expect, test } from 'vitest';
import { email, endsWith } from '../../actions/index.ts';
import { pipe } from '../../methods/index.ts';
import { array, object, string } from '../../schemas/index.ts';
import { deleteGlobalConfig, setGlobalConfig } from '../../storages/index.ts';
import type {
  StandardFailureResult,
  StandardProps,
  StandardSuccessResult,
} from '../../types/index.ts';
import { _getStandardProps } from './_getStandardProps.ts';

describe('_getStandardProps', () => {
  test('should return spec properties', () => {
    expect(_getStandardProps(string())).toStrictEqual({
      version: 1,
      vendor: 'valibot',
      validate: expect.any(Function),
    } satisfies StandardProps<string, string>);
  });

  test('should validate simple input', () => {
    const props = _getStandardProps(string());
    expect(props.validate('foo')).toMatchObject({
      value: 'foo',
    } satisfies StandardSuccessResult<string>);
    expect(props.validate(null)).toMatchObject({
      issues: [
        {
          message: 'Invalid type: Expected string but received null',
        },
      ],
    } satisfies StandardFailureResult);
    expect(props.validate(123)).toMatchObject({
      issues: [
        {
          message: 'Invalid type: Expected string but received 123',
        },
      ],
    } satisfies StandardFailureResult);
  });

  test('should validate complex input', () => {
    const props = _getStandardProps(
      object({ nested: array(object({ key: string() })) })
    );
    const input1 = { nested: [{ key: 'foo' }, { key: 'bar' }] };
    expect(props.validate(input1)).toMatchObject({
      value: input1,
    } satisfies StandardSuccessResult<{ nested: { key: string }[] }>);
    const input2 = { nested: [{ key: 'foo' }, { key: 123 }] };
    expect(props.validate(input2)).toMatchObject({
      issues: [
        {
          message: 'Invalid type: Expected string but received 123',
          path: [{ key: 'nested' }, { key: 1 }, { key: 'key' }],
        },
      ],
    } satisfies StandardFailureResult);
  });

  test('should use global config', () => {
    const props = _getStandardProps(
      pipe(string(), email(), endsWith('@example.com'))
    );
    expect(props.validate('foo')).toMatchObject({
      issues: [
        {
          message: 'Invalid email: Received "foo"',
        },
        {
          message: 'Invalid end: Expected "@example.com" but received "foo"',
        },
      ],
    } satisfies StandardFailureResult);
    setGlobalConfig({ abortPipeEarly: true });
    expect(props.validate('foo')).toMatchObject({
      issues: [
        {
          message: 'Invalid email: Received "foo"',
        },
      ],
    } satisfies StandardFailureResult);
    deleteGlobalConfig();
  });
});
