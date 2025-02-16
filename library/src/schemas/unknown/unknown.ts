import type { BaseSchema, SuccessDataset } from '../../types/index.ts';
import { _getStandardProps } from '../../utils/index.ts';

/**
 * Unknown schema interface.
 */
export interface UnknownSchema extends BaseSchema<unknown, unknown, never> {
  /**
   * The schema type.
   */
  readonly type: 'unknown';
  /**
   * The schema reference.
   */
  readonly reference: typeof unknown;
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
// @__NO_SIDE_EFFECTS__
export function unknown(): UnknownSchema {
  return {
    kind: 'schema',
    type: 'unknown',
    reference: unknown,
    expects: 'unknown',
    async: false,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset) {
      // @ts-expect-error
      dataset.typed = true;
      // @ts-expect-error
      return dataset as SuccessDataset<unknown>;
    },
  };
}
