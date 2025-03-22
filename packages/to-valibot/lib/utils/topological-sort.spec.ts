import { describe, expect, it } from 'vitest';
import { topologicalSort } from './topological-sort';

describe('#topologicalSort()', () => {
  it('should sort provided objects', () => {
    const res = topologicalSort(
      {
        lorem: null,
        baz: null,
        bar: null,
        foo: null,
      },
      {
        lorem: ['foo'],
        bar: ['lorem'],
        baz: ['bar', 'foo'],
      }
    );

    expect(res).toEqual([
      ['foo', null],
      ['lorem', null],
      ['bar', null],
      ['baz', null],
    ]);
  });
});
