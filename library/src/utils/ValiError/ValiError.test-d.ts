import { describe, expectTypeOf, test } from 'vitest';
import {
  minLength,
  type MinLengthIssue,
  url,
  type UrlIssue,
} from '../../actions/index.ts';
import { pipe } from '../../methods/index.ts';
import { string, type StringIssue } from '../../schemas/index.ts';
import { ValiError } from './ValiError.ts';

describe('ValiError', () => {
  test('should infer issues from schema', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const schema = pipe(string(), minLength(10), url());
    const error = new ValiError<typeof schema>([
      {
        kind: 'validation',
        type: 'min_length',
        input: 'foo',
        expected: '>=10',
        received: '3',
        message: 'Invalid length: Expected >=10 but received 3',
        requirement: 10,
      },
    ]);
    type Issue = StringIssue | MinLengthIssue<string, 10> | UrlIssue<string>;
    expectTypeOf(error.issues).toEqualTypeOf<[Issue, ...Issue[]]>();
  });
});
