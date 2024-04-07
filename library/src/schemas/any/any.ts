/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseSchema } from '../../types/index.ts';

/**
 * Any schema type.
 */
export interface AnySchema extends BaseSchema<any, any, never> {
  /**
   * The schema type.
   */
  readonly type: 'any';
  /**
   * The expected property.
   */
  readonly expects: 'any';
}

/**
 * Creates an any schema.
 *
 * Hint: This schema function exists only for completeness and is not
 * recommended in practice. Instead, `unknown` should be used to accept
 * unknown data.
 *
 * @returns An any schema.
 */
export function any(): AnySchema {
  return {
    kind: 'schema',
    type: 'any',
    expects: 'any',
    async: false,
    _run(dataset) {
      dataset.typed = true;
      return dataset;
    },
  };
}
