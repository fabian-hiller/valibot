import { expect } from 'vitest';
import { comparable } from './comparable.ts';

declare module 'vitest' {
  interface Assertion {
    toEqualSchema(schema: unknown): void;
  }
}

expect.extend({
  toEqualSchema(received: unknown, expected: unknown) {
    return {
      pass: this.equals(received, comparable(expected)),
      message: () => `expect(received).toEqualSchema(expected):`,
      actual: received,
      expected,
    };
  },
});
