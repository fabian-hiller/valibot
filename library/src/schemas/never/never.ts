import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchema } from '../../types.ts';

/**
 * Never schema type.
 */
export type NeverSchema = BaseSchema<never> & {
  schema: 'never';
};

/**
 * Creates a never schema.
 *
 * @param error The error message.
 *
 * @returns A never schema.
 */
export function never(error?: string): NeverSchema {
  return {
    /**
     * The schema type.
     */
    schema: 'never',

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    parse(input, info) {
      throw new ValiError([
        {
          reason: 'type',
          validation: 'never',
          origin: 'value',
          message: error || i18next.t("schemas.never"),
          input,
          ...info,
        },
      ]);
    },
  };
}
