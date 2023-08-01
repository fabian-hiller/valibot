import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchema } from '../../types.ts';

/**
 * Void schema type.
 */
export type VoidSchema<TOutput = void> = BaseSchema<void, TOutput> & {
  schema: 'void';
};

/**
 * Creates a void schema.
 *
 * @param error The error message.
 *
 * @returns A void schema.
 */
export function voidType(error?: string): VoidSchema {
  return {
    /**
     * The schema type.
     */
    schema: 'void',

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
      // Check type of input
      if (typeof input !== 'undefined') {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'void',
            origin: 'value',
            message: error || i18next.t("schemas.voidType"),
            input,
            ...info,
          },
        ]);
      }

      // Return output
      return input;
    },
  };
}
