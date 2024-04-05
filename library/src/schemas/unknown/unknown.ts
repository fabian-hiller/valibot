import type { BaseSchema } from '../../types/index.ts';

/**
 * Unknown schema type.
 */
export interface UnknownSchema extends BaseSchema<unknown, unknown, never> {
  /**
   * The schema type.
   */
  readonly type: 'unknown';
  /**
   * The expected property.
   */
  readonly expects: 'unknown';
}

/**
 * Creates a unknown schema.
 *
 * @returns A unknown schema.
 */
export function unknown(): UnknownSchema {
  return {
    kind: 'schema',
    type: 'unknown',
    expects: 'unknown',
    async: false,
    _run(dataset) {
      return dataset;
    },
  };
}
