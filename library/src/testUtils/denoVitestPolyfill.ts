export * from 'jsr:@std/testing@0.218.2/bdd';
export { it as test } from 'jsr:@std/testing@0.218.2/bdd';
export { expectTypeOf } from 'npm:expect-type@0.16.0';
import jestExpect from 'npm:expect@29.7.0';
export const expect = jestExpect.default;
