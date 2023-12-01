import { describe, expect, test } from 'vitest';
import { parse } from './parse.ts';
import type { BaseValidation } from '../../types/pipe.ts';

describe('parse', () => {
  test('should return true, if validation has output', () => {
    const validationMock: BaseValidation = {
      async: false,
      message: 'some error message',
      _parse: (val: string) => {
        return { output: val };
      },
    };
    const res = parse(validationMock, 'some value');
    expect(res).toBeTruthy();
  });

  test('should return false, if validation has issues', () => {
    const validationMock: BaseValidation<string> = {
      async: false,
      message: 'some error message',
      _parse: (input: string) => {
        return {
          issues: [
            {
              reason: 'type',
              validation: 'any',
              origin: 'value',
              message: 'error',
              input: input,
            },
          ],
        };
      },
    };
    const res = parse(validationMock, 'some value');
    expect(res).toBeFalsy();
  });
});
