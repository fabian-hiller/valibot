import { expect } from 'vitest';
import { comparable } from './comparable.ts';

declare module 'vitest' {
  interface Assertion {
    toEqualSchema(schema: unknown): void;
  }
}

expect.extend({
  toEqualSchema(actual: unknown, expected: unknown) {
    return {
      pass: this.equals(actual, comparable(expected)),
      message: () => `expect(actual).toEqualSchema(expected):`,
      actual,
      expected,
    };
  },
});
