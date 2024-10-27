import { describe, expect, test } from 'vitest';
import type { MinLengthIssue, UrlIssue } from '../../actions/index.ts';
import { ValiError } from './ValiError.ts';

describe('ValiError', () => {
  test('should create error instance', () => {
    const minLengthIssue: MinLengthIssue<string, 10> = {
      kind: 'validation',
      type: 'min_length',
      input: 'foo',
      expected: '>=10',
      received: '3',
      message: 'Invalid length: Expected >=10 but received 3',
      requirement: 10,
    };

    const urlIssue: UrlIssue<string> = {
      kind: 'validation',
      type: 'url',
      input: 'foo',
      expected: null,
      received: '"foo"',
      message: 'Invalid URL: Received "foo"',
      requirement: expect.any(Function),
    };

    const error = new ValiError([minLengthIssue, urlIssue]);
    expect(error).toBeInstanceOf(ValiError);
    expect(error.name).toBe('ValiError');
    expect(error.message).toBe(minLengthIssue.message);
    expect(error.issues).toStrictEqual([minLengthIssue, urlIssue]);
  });
});
