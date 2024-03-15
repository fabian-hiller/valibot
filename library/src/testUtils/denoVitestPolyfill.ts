import jestExpect from 'npm:expect@29.7.0';
import jestFn from 'npm:jest-mock@29.7.0';

export * from 'jsr:@std/testing@0.218.2/bdd';
export { it as test } from 'jsr:@std/testing@0.218.2/bdd';
export { expectTypeOf } from 'npm:expect-type@0.16.0';

export const expect = jestExpect.default;
export const vi = { fn: jestFn.fn };
