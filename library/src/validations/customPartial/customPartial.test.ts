import { assert, describe, expect, test } from 'vitest';
import { customPartial } from './customPartial.js';
import { object, string } from '../../schemas/index.js';
import { safeParse } from '../../methods/index.js';
import { length } from '../length/length.js';

describe('customPartial', () => {
  test('should run before entire object is valid', () => {
    const schema = object({
      username: string(),
      password: string(),
      passwordConfirmation: string()
    }, [
      customPartial(
        ['password', 'passwordConfirmation'],
        (input) => input.password === input.passwordConfirmation)
    ])

    const result = safeParse(schema, {
      username: 5,
      password: 'password',
      passwordConfirmation: 'wrong password'
    })

    assert(!result.success)
    expect(result.issues.length).toEqual(2)
    expect(result.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({
        validation: 'string',
        path: expect.arrayContaining([expect.objectContaining({
          key: 'username'
        })])
      }),
      expect.objectContaining({
        validation: 'customPartial',
        path: expect.arrayContaining([expect.objectContaining({
          key: 'passwordConfirmation'
        })])
      })
    ]))
  });

  test('should only run when required fields are valid', () => {
    const schema = object({
      username: string(),
      password: string([length(100)]),
      passwordConfirmation: string()
    }, [
      customPartial(
        ['password', 'passwordConfirmation'],
        (input) => input.password === input.passwordConfirmation)
    ])

    const result = safeParse(schema, {
      username: 5,
      password: 'password',
      passwordConfirmation: 'wrong password'
    })

    assert(!result.success)
    expect(result.issues).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        validation: 'customPartial'
      })
    ]))
  });
});
