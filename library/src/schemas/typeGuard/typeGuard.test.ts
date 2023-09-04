import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { typeGuard } from './typeGuard.ts';

describe('typeguard', () => {
  type FooBar = 'foo' | 'bar'

  function isFooBar(arg: any): arg is FooBar {
    return ['foo', 'bar'].includes(arg)
  }

  test('should pass according to given typeguard', () => {
    const schema = typeGuard(isFooBar);
    const input = 'foo';
    const output = parse(schema, input);
    expect(output).toBe(input);
    expect(() => parse(schema, 'baz')).toThrowError();
  });
});
